# Server

## Setup

1. clone the repo
2. `cd server && yarn`
3. add the following keys to a `.env` file in the project's root:

```
MONGO_URI="mongodb+srv://admin:WeOk7i8KdtbRNjBd@textme-production.q9wntfo.mongodb.net/?retryWrites=true&w=majority"
TWILIO_SID="AC7c741f7fbfc22f1a58d1e48f0071a858"
TWILIO_AUTH_TOKEN="5e4f6929f6d6782e5ce70810897fbb12"
TWILIO_FROM_PHONE_NUMBER="+19498284894"
TWILIO_SERVICE_SID="VA773dbd6c542bef4632f8cd24de219b5d"
STRIPE_API_KEY="pk_live_51M6jlKCAy8F1wbayza18mcmx9iMKsoTm2Ncg6bV945BDEMWWW7FuWOVmv5Uc30iZQzEMEoykDAVzpSn0I6bkYdiz00X2SxGl0x"
STRIPE_SECRET_KEY="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"
STRIPE_WEBHOOK_SECRET="we_1M6jqQCAy8F1wbay7u7eC3mK"
LINKEDIN_SCRAPER_API_KEY="7JDAhIoFeZE0zGPOJKk0kBhJ5C7zG9p2"
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/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"

PROJECT_ID="textme-7713a"
PRIVATE_KEY_ID="fd465e94855f0bccb49fca0a26bd5dcb65a63c79"
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpgVRH/Tx8NWzO\nXrQtPzUFMph6/RZT/W6Z68VRrcA+1uejqVpfP4QPrrQJaZ6sDxZxQ+WN1c3yxytN\n1tPVq25NOc8hKQNCkKNgX84aXdlOwUQIZkZxLiJWxOlEfkXQFyk3yp+rDN8cFNiR\nGhwKks0xte/Hw99q8yKJ4eMoHo8Nki1R79SbkYzGOeuxYA5C/Qp3usMBlSRZGcdt\n8CwJkr8BPXgkLI2Z+LyCwQG1fNGsVYG+ekSrygxjzYY0qU6yR1UHCucTdqZN+yDp\nsakFa2rZ1drGzuhF49bOu5PibejHbQA/HAkNvs++YmLne6SC9hPUVqWy7Ju4FSOW\nGKbl424lAgMBAAECggEAJyrOtknCObNAnpkMii4CSt6rlDO5/pNfhKqRsDN1ai/P\nW6ZszviGw/bq/AfPVdOwrGBzgSgnzBMQow5iaYuQ08BpZ7Cp4643SjQpFDeeWI/Y\n8BXt7gYqgiFDA4QoDpLjf9ROu8AgJ8V7W2AMnbbZOkTfkKnmjLh8wR6UljcleA1w\nC14ZOHnsXnep/Alml/JwfjTk9q/cj6HLaTogn45+PU6RAyK5gtMwEu9KfOFytIVe\nhJ5d59XTGGCG3GhljH4bNSy1YfiMZMB7CFNPL/FCNM0jLYmiwiw37+uR56/FSuo+\nh4Nj+By34Tf9GD7bchk9ENvC9ffDOL3K3Vqo5iulcQKBgQDbkOp5GKTFp76dAG77\nKLtHdEXm33bnwzsS7mESMjIO6TTebQaENZf11VynULzGyXA2ifRyLdac+RXwquY9\ngaH6zXlpk0/KAFBOHL8AI8tYqI2Josd+TWJVK56XczJj7OokS76883e68NFCc4GG\nLvT12sluFQ8OmVJXofyuHj6FWQKBgQDFodiGKU0Jg9wsa+U42G2wtiBxMx5174Cc\nhtX+jbq1y1J+uSgA7iq3PbQNgckV0N2ET23MxlNWkC0plZL9f2UcOs3FtP9wxkCa\n2TcQuWJMQo20IhRgAi0H0VtIozzSLHLktiUBDZiFXZlnpxcFzurGQOBiWTXvf5ea\nT0khCra5rQKBgBSpO1cv2Xl8AnTVsJvTxmO/7j/+cTr35Rwv8FR9ArbifQYdLkrM\nnEMW08Qu1cTC+ds3+hewdoyI5+agvk+1Xh+yrCUiJpT0mJnxHIwP0jfCjKcR+UHK\nWGF5XFAWF/zNM2887XLsWizuMlLVea+9xXFJKEFCnAscpGH4rUVZNTrpAoGAWFRU\nvOm6p7UKc8QpZ/W7WM6dw1pQk+9ecRcGj8XynAvqq/6/NWM9LjbiwWKvaBO43cjO\nT0aYusinlr1mO+xzWWGi1Gln/ZRuDYdlyBDDMUhRox/UMXDnhWX5wYZLybfaBgSu\nl0DnWTwTMzOH462uWrtmTi6HH6rMLEiha6YpMuUCgYBQJMCL4BCTzfJj5HYfp2i+\n9MgWV5Jp8gB758ad/zKTaW9UdFMxkvieHgWuRbHs2OScuoNVvTitGj1GtRx85WEY\nCSPVeRnSr4rYncA4JC2joh9mzqjeRhxeTMAhTbgTzh2rZo7TAXEtjRmhAOH7IuY1\nKtSChCGW+Co7pMk2we4Rng==\n-----END PRIVATE KEY-----\n"
CLIENT_EMAIL="firebase-adminsdk-fmjjr@textme-7713a.iam.gserviceaccount.com"
CLIENT_ID="101359262442567674778"
CLIENT_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fmjjr%40textme-7713a.iam.gserviceaccount.com"
```

4. `npm run dev` starts the server in debug mode
5. `npm run test` runs all tests using jest

## Running Backfills

1. Write your script and copy the overall setup from `src/backfills/08_14_2022_example.ts`.
2. Test your backfill on individual documents (if we have staging setup, use staging for this step. If we don't, use prod carefully in this step.) before having it change all documents in prod. If we have a staging database setup, change the mongo uri for the backfill and connect to that staging database and do a full test run. Once confident it will work, you can run on prod.
3. To actually run a backfill, go to your terminal inside the /server folder root and run this command: `npx ts-node src/backfills/YOUR_FILE_NAME.ts`

## Best Practices

- Route -> Validator (middleware) -> Controller (middleware) -> Service (called by controller)
- When throwing an error, do `throw new ApiError` (or use/create another error class from `src/utils/errors.ts`) instead of `throw new Error`. This is necessary so that `TestHelper.expectError` works properly.
- Don't call multiple endpoints in a single unit test. If you need to create a user for example to use for your test, use the `UserFactory` or create another factory equivalent.
