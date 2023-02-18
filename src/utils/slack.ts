import { IncomingWebhook } from "@slack/webhook";
import { config } from "./config";

type LogContent = {
  channel: string;
  text: string;
  username: string;
  icon_emoji?: string;
};

const _webhook = new IncomingWebhook(config.slack.webhookUrl);

export const SlackLogger = {
  log: async (content: LogContent) => {
    try {
      if (config.environment.isProd) {
        await _webhook.send(content);
      }
    } catch (e) {
      console.error(e);
    }
  },
};
