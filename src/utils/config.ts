import { queryBool } from "./express";

export const config = {
  environment: {
    defaultPort: 5900,
    isDev: process.env.IS_DEV,
    isTest: process.env.IS_TEST,
    isProd: !process.env.IS_DEV && !process.env.IS_TEST,
  },
  mongoUri: process.env.MONGO_URI || "",
  linkedInScraperApiKey: process.env.LINKEDIN_SCRAPER_API_KEY || "",
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || "",
  },
  firebase: {
    type: "service_account",
    project_id: process.env.PROJECT_ID || "",
    private_key_id: process.env.PRIVATE_KEY_ID || "",
    private_key: (process.env.PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL || "",
    client_id: process.env.CLIENT_ID || "",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_CERT_URL || "",
  },
  twilio: {
    sid: process.env.TWILIO_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    fromPhoneNumber: process.env.TWILIO_FROM_PHONE_NUMBER || "",
    serviceSid: process.env.TWILIO_SERVICE_SID || "",
  },
  sentryDsn: process.env.SENTRY_DSN || "",
  sendgrid: {
    fromEmail: "andy@trywibu.com",
    apiKey: process.env.SENDGRID_API_KEY || "",
  },
  encryptionKey: process.env.ENCRYPTION_KEY || "testkey",
  commoditiesApiKey: process.env.COMMODITIES_API_KEY || "",
  stripe: {
    apiKey: process.env.STRIPE_API_KEY || "",
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },
};
