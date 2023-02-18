import mongoose from "mongoose";
import { User } from "../models/User";
import { TwilioUtil } from "../utils/twilio";

// MAKE SURE YOU UNDERSTAND IF THIS URI POINTS TO STAGING OR PROD!
const MONGO_URI_TO_CONNECT_TO = "";

// -- write a description here on what the backfill does -- //
const executeBackfillBody = async () => {
  // -- write your code here -- //
  const usersNotFullyOnboarded = await User.find({ firstName: null });
  console.log(usersNotFullyOnboarded.length);
  let numFailures = 0;
  let numSuccesses = 0;
  await Promise.all(
    usersNotFullyOnboarded.map(async (user) => {
      try {
        if (user.isLookingForRecruiters) {
          await TwilioUtil.sendMessage(
            user.phoneNumber,
            `Hey, noticed you haven't finished creating your TextMe recruiting account yet. If you still want to be shown to startup founders who are recruiting, please finish creating your account using this link (takes 1 minute): https://textme.today/nav/edit-profile\n\nPlease do not reply to this message.`
          );
        } else {
          await TwilioUtil.sendMessage(
            user.phoneNumber,
            `Hey, noticed you haven't finished creating your TextMe account yet. Please finish creating your account using this link (takes 1 minute): https://textme.today/nav/edit-profile\n\nPlease do not reply to this message.`
          );
        }
        numSuccesses++;
      } catch (e) {
        console.error(e);
        numFailures++;
      }
    })
  );
  console.log(numFailures + " failures");
  console.log(numSuccesses + " successes");
};

const executeBackfill = async () => {
  try {
    console.log("Starting Backfill. Please Wait. 🚣🏼‍♀️");
    await mongoose.connect(MONGO_URI_TO_CONNECT_TO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    await executeBackfillBody();
    console.log("Backfill Was Successful 🦾");
  } catch (e) {
    console.error("Backfill Failed 😥");
    console.error(e);
  }
};

// see ReadMe on how to execute your backfill through the terminal.
executeBackfill();
