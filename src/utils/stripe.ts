import { Request, Response } from "express";
import { User } from "src/models/User";
import { UserDocument } from "src/types/User";
import Stripe from "stripe";
import { config } from "./config";
import { constants } from "./constants";
import { ApiError } from "./errors";
import { TwilioUtil } from "./twilio";

export const MyStripe = new Stripe(config.stripe.secretKey, {
  typescript: true,
  apiVersion: "2022-08-01",
});

type InvoiceEventType =
  | "checkout.session.completed"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "customer.subscription.deleted";

export const StripeUtil = {
  getEventType: (req: Request) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    const webhookSecret = config.stripe.webhookSecret;
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = MyStripe.webhooks.constructEvent(
        (req as any).body,
        signature as any,
        webhookSecret
      );
    } catch (err: any) {
      throw new ApiError(
        "Webhook signature verification failed: " + err.message
      );
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;

    return { eventType, data };
  },
  triggerInvoiceEventType: async (eventType: InvoiceEventType, data: any) => {
    const dataObj = data["object"];
    const stripeCustomerId = dataObj["customer"];
    const stripePhoneNumber = dataObj["metadata"]["phoneNumber"];
    let user = await User.findOne({ phoneNumber: stripePhoneNumber });
    if (!user && stripeCustomerId) {
      user = await User.findOne({ stripeCustomerId });
    }
    if (!user) {
      return;
    }
    switch (eventType) {
      case "checkout.session.completed":
        // Payment is successful and the subscription is created.
        // You should provision the subscription and save the customer ID to your database.
        user.stripeCustomerId = stripeCustomerId;
        await user.save();
        break;
      case "invoice.paid":
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        break;
      case "invoice.payment_failed":
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        throw new ApiError(
          `Stripe payment failed for user ${user.phoneNumber}`
        );
      default:
      // Unhandled event type
    }
  },
  createCustomer: async (phoneNumber: string) => {
    const customer = await MyStripe.customers.create({
      phone: phoneNumber,
    });
    return customer.id;
  },
  createExpressAccount: async (user: UserDocument) => {
    const account = await MyStripe.accounts.create({
      country: "US",
      type: "express",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      business_profile: {
        url: `https://textme.today/u/${user._id}`,
      },
      individual: {
        phone: user.phoneNumber,
      },
    });
    return account.id;
  },
  getAccountSetupLink: async (user: UserDocument) => {
    const accountLink = await MyStripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: constants.frontendUrl,
      return_url:
        constants.frontendUrl + "/nav/edit-profile?finished_onboarding=true",
      type: "account_onboarding",
    });
    return accountLink.url;
  },
  getCheckoutSessionUrl: async (userId: string) => {
    const user: UserDocument | null = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        "Cannot get the checkout session url for a user that does not exist."
      );
    }
    const session = await MyStripe.checkout.sessions.create({
      line_items: [
        {
          amount: user.price * 100,
          quantity: 1,
        },
      ],
      cancel_url: `${constants.frontendUrl}/u/${userId}`,
      success_url: `${constants.frontendUrl}/u/${userId}?success=true`,
    });
    return session.url;
  },
};
