import Joi from "joi";
import { groupUserStatusEnum } from "src/types/GroupUser";
import { objectId } from "src/utils/joiFieldValidators";

export const GroupValidator = {
  createGroup: Joi.object({
    name: Joi.string().required(),
    memberUsernames: Joi.array(),
  }),
  decideStatus: Joi.object({
    groupUserId: Joi.string().custom(objectId).required(),
    result: Joi.string(),
    permissionLevel: Joi.string(),
  }),
};
