// import { UserFactory } from "../factories";
// import { TestHelper } from "../TestHelper";
// import * as RankOptionsRoot from "src/utils/rankOptions";
// import { TwilioUtil } from "src/utils/twilio";
// import { fakePromise } from "../jestMocks";
// import {
//   permissionStatusEnum,
//   SelectionRequest,
// } from "src/models/SelectionRequest";
// import { SelectionRequestFactory } from "../factories/SelectionRequestFactory";
// import { User } from "src/models/User";
// import { StripeUtil } from "src/utils/stripe";

// const routeUrl = "/gas";

// describe("RecordSelection", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   it("correctly records selection of gas supplier", async () => {
//     const user = await UserFactory.create();
//     const selectionRequest = await SelectionRequestFactory.create({
//       userId: user._id,
//       permissionStatus: permissionStatusEnum.accepted,
//     });
//     const adminUser = await UserFactory.create({ isAdmin: true });
//     const twilioSpy = jest
//       .spyOn(TwilioUtil, "sendMessage")
//       .mockImplementation(fakePromise);
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/selection",
//       "POST",
//       {
//         selectionRequestId: selectionRequest._id,
//       },
//       {},
//       adminUser.firebaseId
//     );

//     TestHelper.expectSuccess(res);
//     const { selection } = res.body;
//     expect(selection._id.toString()).toBeTruthy();
//     expect(selection.rate).toBe(selectionRequest.rate);
//     expect(selection.name).toBe(selectionRequest.name);
//     const updatedSelectionRequest = await SelectionRequest.findById(
//       selectionRequest._id
//     );
//     expect(updatedSelectionRequest?.selectionId?.toString()).toBe(
//       selection._id.toString()
//     );
//     expect(twilioSpy).toBeCalledTimes(1);
//   });
//   it("fails to record selection of gas supplier because the user is not an admin", async () => {
//     const user = await UserFactory.create();
//     const selectionRequest = await SelectionRequestFactory.create({
//       userId: user._id,
//     });
//     const nonAdminUser = await UserFactory.create({ isAdmin: false });
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/selection",
//       "POST",
//       {
//         selectionRequestId: selectionRequest._id,
//       },
//       {},
//       nonAdminUser.firebaseId
//     );

//     TestHelper.expectError(res, "Need to be an admin to make this request");
//   });
// });

// describe("GetOptions", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   it("correctly gets the gas supplier options for a user", async () => {
//     const user = await UserFactory.create();
//     const adminUser = await UserFactory.create({ isAdmin: true });
//     const rankOptionsSpy = jest
//       .spyOn(RankOptionsRoot, "rankOptions")
//       .mockImplementation(() =>
//         Promise.resolve([
//           {
//             rate: 3,
//           },
//           {
//             rate: 5,
//           },
//         ])
//       );
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/options",
//       "GET",
//       {},
//       {
//         userId: user.id,
//       },
//       adminUser.firebaseId
//     );

//     TestHelper.expectSuccess(res);
//     const { options } = res.body;
//     expect(options.length).toBe(2);
//     expect(rankOptionsSpy).toBeCalledTimes(1);
//   });
//   it("fails to get options for a user because the user is not an admin", async () => {
//     const user = await UserFactory.create();
//     const nonAdminUser = await UserFactory.create({ isAdmin: false });
//     const rankOptionsSpy = jest
//       .spyOn(RankOptionsRoot, "rankOptions")
//       .mockImplementation(() =>
//         Promise.resolve([
//           {
//             rate: 3,
//           },
//           {
//             rate: 5,
//           },
//         ])
//       );
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/options",
//       "GET",
//       {},
//       {
//         userId: user.id,
//       },
//       nonAdminUser.firebaseId
//     );

//     TestHelper.expectError(res, "Need to be an admin to make this request");
//     expect(rankOptionsSpy).toBeCalledTimes(0);
//   });
// });

// describe("StartJourney", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   it("correctly starts the journey for a new user", async () => {
//     const phoneNumber = "440 666 4580";
//     const sendMessageSpy = jest
//       .spyOn(TwilioUtil, "sendMessage")
//       .mockImplementation(fakePromise);
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/journey",
//       "POST",
//       { phoneNumber },
//       {}
//     );

//     TestHelper.expectSuccess(res);
//     const { user } = res.body;
//     expect(user.phoneNumber).toBe("+14406664580");
//     expect(user.firebaseId).toBeTruthy();
//     expect(sendMessageSpy).toBeCalledTimes(3);
//   });
//   it("fails to start the journey for a user that already exists", async () => {
//     const phoneNumber = "+12164034709";
//     await UserFactory.create({ phoneNumber });
//     const sendMessageSpy = jest
//       .spyOn(TwilioUtil, "sendMessage")
//       .mockImplementation(fakePromise);
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/journey",
//       "POST",
//       { phoneNumber },
//       {}
//     );

//     TestHelper.expectError(res, "This user already exists.");
//     expect(sendMessageSpy).toBeCalledTimes(0);
//   });
// });

// describe("RequestSelectionPermission", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   it("correctly requests selection permission for a paying user", async () => {
//     const user = await UserFactory.create({ isPaying: true });
//     const adminUser = await UserFactory.create({ isAdmin: true });
//     const sendMessageSpy = jest
//       .spyOn(TwilioUtil, "sendMessage")
//       .mockImplementation(fakePromise);
//     const stripeSpy = jest
//       .spyOn(StripeUtil, "generateSubscriptionLink")
//       .mockImplementation(fakePromise);
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/ask-selection-permission",
//       "POST",
//       {
//         userId: user._id,
//         name: "Test1",
//         rate: 7.34,
//         termLength: 3,
//         monthlyFee: 0,
//         earlyTerminationFee: 0,
//         isFixed: true,
//       },
//       {},
//       adminUser.firebaseId
//     );

//     TestHelper.expectSuccess(res);
//     const { selectionRequest } = res.body;
//     expect(selectionRequest.name).toBe("Test1");
//     expect(sendMessageSpy).toBeCalledTimes(1);
//     expect(stripeSpy).toBeCalledTimes(0);
//   });
//   it("correctly requests selection permission for a non-paying user", async () => {
//     const user = await UserFactory.create({ isPaying: false });
//     const adminUser = await UserFactory.create({ isAdmin: true });
//     const sendMessageSpy = jest
//       .spyOn(TwilioUtil, "sendMessage")
//       .mockImplementation(fakePromise);
//     const stripeSpy = jest
//       .spyOn(StripeUtil, "generateSubscriptionLink")
//       .mockImplementation(fakePromise);
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/ask-selection-permission",
//       "POST",
//       {
//         userId: user._id,
//         name: "Test2",
//         rate: 7.34,
//         termLength: 3,
//         monthlyFee: 0,
//         earlyTerminationFee: 0,
//         isFixed: true,
//       },
//       {},
//       adminUser.firebaseId
//     );

//     TestHelper.expectSuccess(res);
//     const { selectionRequest } = res.body;
//     expect(selectionRequest.name).toBe("Test2");
//     expect(sendMessageSpy).toBeCalledTimes(2);
//     expect(stripeSpy).toBeCalledTimes(1);
//   });
//   it("fails to request selection permission because the user making the call is not an admin", async () => {
//     const user = await UserFactory.create({ isPaying: true });
//     const adminUser = await UserFactory.create({ isAdmin: false });
//     const sendMessageSpy = jest
//       .spyOn(TwilioUtil, "sendMessage")
//       .mockImplementation(fakePromise);
//     const stripeSpy = jest
//       .spyOn(StripeUtil, "generateSubscriptionLink")
//       .mockImplementation(fakePromise);
//     const res = await TestHelper.sendRequest(
//       routeUrl + "/ask-selection-permission",
//       "POST",
//       {
//         userId: user._id,
//         name: "Test2",
//         rate: 7.34,
//         termLength: 3,
//         monthlyFee: 0,
//         earlyTerminationFee: 0,
//         isFixed: true,
//       },
//       {},
//       adminUser.firebaseId
//     );

//     TestHelper.expectError(res, "Need to be an admin to make this request");
//   });
// });
