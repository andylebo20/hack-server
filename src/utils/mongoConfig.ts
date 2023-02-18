import mongoose from "mongoose";
import { config } from "./config";
import { constants } from "./constants";

export async function startMongo() {
  mongoose
    .connect(config.mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("🍃 Connected to MongoDB");
      console.log(
        `🏄🏼‍♂️ You can now send requests to ${constants.localServerUrl}/{{route_path}}`
      );
    })
    .catch((e) => {
      console.log("Error connecting to mongo: " + e);
      process.exit(1);
    });
}
