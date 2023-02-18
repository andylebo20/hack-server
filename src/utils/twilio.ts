import { Twilio } from "twilio";
import { config } from "./config";
import { ApiError } from "./errors";
import firebase from "../../firebaseConfig";
import { User } from "../models/User";
import { StripeUtil } from "./stripe";
import { PartialUser } from "src/models/PartialUser";
import { PartialUserDocument } from "src/types/PartialUser";
import _ from "lodash";
import { UserDocument } from "src/types/User";
import { constants } from "./constants";
import { SlackLogger } from "./slack";
import { getErrorMessage, getShareableLink } from "./helpers";

export const MyTwilio = new Twilio(config.twilio.sid, config.twilio.authToken);

export const TwilioUtil = {
  sendVerificationCode: async (phoneNumber: string) =>
    MyTwilio.verify
      .services(config.twilio.serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" }),
  submitVerificationCode: async (
    phoneNumber: string,
    code: string,
    partialUserId?: string,
    referredUsername?: string
  ) => {
    let isApproved = false;
    try {
      const result = await MyTwilio.verify
        .services(config.twilio.serviceSid)
        .verificationChecks.create({ to: phoneNumber, code });
      const { status } = result;
      isApproved = status === "approved";
    } catch (e: any) {
      SlackLogger.log({
        channel: "#error-logs",
        text: getErrorMessage(e),
        username: "Error Logger (no explode though)",
        icon_emoji: ":face_with_diagonal_mouth:",
      });
    }

    if (!isApproved) {
      throw new ApiError("The code you entered was incorrect.");
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      // login existing user
      return firebase.auth().createCustomToken(existingUser.firebaseId);
    }

    // sign up new user if there is no existing user with this phone number
    let partialUser: PartialUserDocument | null = null;
    if (partialUserId) {
      partialUser = await PartialUser.findById(partialUserId);
    }
    let referrerUser: UserDocument | null = null;
    if (referredUsername) {
      referrerUser = await User.findOne({ username: referredUsername });
      if (referrerUser) {
        const referralsForUser = await User.find({
          referredByUser: referrerUser._id,
        }).countDocuments();
        const isBoosted =
          referralsForUser + 1 >= constants.referralsNeededForBoost;
        if (isBoosted) {
          referrerUser.isBoosted = isBoosted;
          await referrerUser.save();
        }
      }
    }
    const newFirebaseUser = await firebase.auth().createUser({
      phoneNumber,
    });
    const stripeCustomerId = await StripeUtil.createCustomer(phoneNumber);
    const newUser = new User({
      firebaseId: newFirebaseUser.uid,
      phoneNumber,
      stripeCustomerId,
      numViews: 0,
      ...(partialUser && {
        firstName: partialUser.firstName,
        lastName: partialUser.lastName,
        personalUrl: partialUser.personalUrl,
        jobTitle: partialUser.jobTitle,
        username: (partialUser.firstName + partialUser.lastName)
          .toLowerCase()
          .split(" ")
          .join(""),
        wasPrefilled: true,
        isLookingForRecruiters: !partialUser.isRecruiter,
      }),
      ...(referrerUser && {
        referredByUser: referrerUser._id,
        isLookingForRecruiters: true,
      }),
    });

    if (partialUser) {
      partialUser.userId = newUser._id;
      await partialUser.save();
    }
    const stripeAccountId = await StripeUtil.createExpressAccount(newUser);
    newUser.stripeAccountId = stripeAccountId;
    await newUser.save();
    SlackLogger.log({
      channel: "#sign-up-logs",
      text: `New user signed up.\nisLookingForRecruiters: ${
        newUser.isLookingForRecruiters
      }\nName: ${
        newUser.firstName && newUser.lastName
          ? `${newUser.firstName} ${newUser.lastName}`
          : "N/A"
      }\nLink: ${
        newUser.username ? getShareableLink(newUser) : "N/A"
      }\n_id: ${newUser._id.toString()}`,
      username: "Sign Up Logger",
      icon_emoji: ":tada:",
    });
    return firebase.auth().createCustomToken(newUser.firebaseId);
  },
  sendMessage: async (toPhoneNumber: string, message: string) =>
    MyTwilio.messages.create({
      to: toPhoneNumber,
      body: message,
      from: config.twilio.fromPhoneNumber,
    }),
};
