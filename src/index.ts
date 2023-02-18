require("dotenv").config(); // must be first line
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import routes from "./routes";
import { config } from "./utils/config";
import { exceptionHandler } from "./utils/exceptionHandler";
import { startMongo } from "./utils/mongoConfig";
import rateLimit from "express-rate-limit";

const SERVER_MSG = `You're staring at the TextMe server.`;

const port = process.env.PORT || config.environment.defaultPort;
export const app = express();

const limiterSendMessage = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/users/send-message", limiterSendMessage);

const limiterSearch = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/users/search", limiterSearch);

app.use(cors());
app.use("/api/users/invoice-webhook", bodyParser.raw({ type: "*/*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (_, res) => res.send(SERVER_MSG));
app.use("/api", routes);
app.use(exceptionHandler); // must be last middleware func

const setupServer = async () => {
  await startMongo();
  // startAllJobs();

  if (config.environment.isProd) {
    Sentry.init({
      dsn: config.sentryDsn,
      tracesSampleRate: 1.0,
    });
  }

  app.listen(port, () => {
    console.log(`💪 Server is running on port: ${port}`);
  });
};

if (!config.environment.isTest) {
  setupServer();
}
