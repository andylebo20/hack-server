import Joi from "joi";

export const UserValidator = {
  sendCode: Joi.object({
    phoneNumber: Joi.string().required(),
  }),
  verifyCode: Joi.object({
    phoneNumber: Joi.string().required(),
    code: Joi.string().required(),
    partialUserId: Joi.string(),
    referredUsername: Joi.string(),
  }),
  updateUser: Joi.object({
    placeholderText: Joi.string().allow(""),
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string(),
    price: Joi.number().min(0),
    typicalResponseTimeInHours: Joi.number().min(0),
    jobTitle: Joi.string().allow(""),
    personalUrl: Joi.string(),
    hasOnboardedStripeAccount: Joi.boolean(),
    canPeopleTextMe: Joi.boolean(),
    isLookingForRecruiters: Joi.boolean(),
    shouldHideMeFromSearchResults: Joi.boolean(),
  }),
  sendMessage: Joi.object({
    message: Joi.string().required(),
    toUsername: Joi.string().required(),
  }),
  deleteStripeCard: Joi.object({
    cardId: Joi.string().required(),
  }),
  getUserByUsername: Joi.object({
    id: Joi.string().required(),
  }),
  searchForUsers: Joi.object({
    query: Joi.string().required(),
  }),
  bulkSearch: Joi.object({
    queries: Joi.array(),
    overrideOnlyBoostedRecruits: Joi.boolean(),
  }),
  createPartialUser: Joi.object({
    personalUrl: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    jobTitle: Joi.string(),
    isRecruiter: Joi.boolean(),
  }),
};
