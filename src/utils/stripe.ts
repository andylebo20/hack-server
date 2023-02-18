import { Request, Response } from "express";
import Stripe from "stripe";
import { config } from "./config";
import { constants } from "./constants";
import { ApiError } from "./errors";
import { Booking } from "src/models/Booking";

export const MyStripe = new Stripe(config.stripe.secretKey, {
  typescript: true,
  apiVersion: "2022-08-01",
});

type InvoiceEventType =
  | "checkout.session.completed"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "customer.subscription.deleted";

const stripe = new Stripe(config.stripe.secretKey, {
  typescript: true,
  apiVersion: "2022-08-01",
});

export const StripeUtil = {
  startCheckoutSession: async (property, emailOfRenter, nameOfRenter) => {
    const priceToPayInDollars = property.price;
    return stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: priceToPayInDollars * 100,
            product_data: {
              name: "Reservation",
              description: property.address,
              images: [property.pictureUrl],
            },
          },
          quantity: 1,
        },
      ],
      customer_email: emailOfRenter,
      allow_promotion_codes: true,
      // Note from Stripe docs:
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `http://localhost:3000/checkout-success/${property._id.toString()}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/property/${property._id.toString()}`,
      metadata: {
        emailOfRenter,
        nameOfRenter,
        propertyId: property._id.toString(),
        pricePaidInDollars: priceToPayInDollars,
      },
    });
  },
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
    const nameOfRenter = dataObj["metadata"]["nameOfRenter"];
    const emailOfRenter = dataObj["metadata"]["emailOfRenter"];
    const propertyId = dataObj["metadata"]["propertyId"];
    const pricePaidInDollars = dataObj["metadata"]["pricePaidInDollars"];

    switch (eventType) {
      case "checkout.session.completed":
        // Payment is successful and the subscription is created.
        // You should provision the subscription and save the customer ID to your database.
        await Booking.create({
          nameOfRenter,
          emailOfRenter,
          propertyId,
          pricePaidInDollars,
        });
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
        throw new ApiError(`Stripe payment failed`);
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
};
