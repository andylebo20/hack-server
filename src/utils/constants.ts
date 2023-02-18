import { config } from "./config";

export const constants = {
  localServerUrl: `http://localhost:${config.environment.defaultPort}/api`,
  frontendUrl: `https://www.textme.today`,
  percentageCommissionWeTake: 0.12,
  maxCharsInMessage: 400,
  referralsNeededForBoost: 3,
};
