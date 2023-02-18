import { jest } from "@jest/globals";
import { FirebaseMock } from "./mocks/FirebaseMock";
import { TwilioMock } from "./mocks/TwilioMock";

export const fakePromise = jest.fn(() => Promise.resolve({} as any));
export const fakeRejectedPromise = jest.fn(() =>
  Promise.reject("some error message")
);

jest.mock("axios");
jest.mock("@sendgrid/mail");
jest.mock("twilio", () => TwilioMock);
jest.mock("firebase-admin", () => FirebaseMock);
