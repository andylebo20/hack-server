import mongoose from "mongoose";
import moment from "moment";
import { PartialUser } from "src/models/PartialUser";

// MAKE SURE YOU UNDERSTAND IF THIS URI POINTS TO STAGING OR PROD!
const MONGO_URI_TO_CONNECT_TO = "";

// -- write a description here on what the backfill does -- //
const executeBackfillBody = async () => {
  // -- write your code here -- //
  const momentThing = moment().subtract(30, "minutes"); // change time here!!! check jungah's screenshot for time
  const partialUsersCreatedVeryRecently = await PartialUser.find({
    createdAt: { $gt: momentThing },
    userId: null,
  });
  const partialUsersCreatedBefore = await PartialUser.find({
    createdAt: { $lte: momentThing },
  });
  const partialUsersCreatedBeforeIds = partialUsersCreatedBefore.map((u) =>
    u._id.toString()
  );
  await Promise.all(
    partialUsersCreatedVeryRecently.map(async (u) => {
      if (partialUsersCreatedBeforeIds.includes(u._id.toString())) {
        await PartialUser.deleteOne({ _id: u._id });
      }
    })
  );
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
