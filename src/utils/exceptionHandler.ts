import * as Sentry from "@sentry/node";
import { config } from "./config";
import { SlackLogger } from "./slack";
import { getErrorMessage } from "./helpers";

export const exceptionHandler = (error, _req, res, _next) => {
  if (config.environment.isTest) {
    return res.send({
      success: false,
      errorMessage: error.message,
      errorCode: error.code,
    });
  } else {
    console.error(error);
    SlackLogger.log({
      channel: "#error-logs",
      text: getErrorMessage(error),
      username: "Error Logger",
      icon_emoji: ":face_with_diagonal_mouth:",
    });
    Sentry.captureException(error);
  }
  res.status(error.code || 500).send(error.message);
};
