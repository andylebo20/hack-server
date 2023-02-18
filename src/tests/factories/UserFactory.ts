import merge from "lodash/merge";
import { User } from "src/models/User";
import faker from "faker";

const getDefaultFields = async () => ({
  isAdmin: false,
  phoneNumber: "+14404988130",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  firebaseId: faker.datatype.uuid(),
  initialPlan: {
    rate: 9,
    earlyTerminationFee: 0,
    monthlyFee: 0,
    billImageUrl: "",
  },
  stripeCustomerId: faker.datatype.uuid(),
});

export const UserFactory = {
  create: async (overrideFields?: Object) => {
    const docFields: any = merge(await getDefaultFields(), overrideFields);
    return User.create(docFields);
  },
};
