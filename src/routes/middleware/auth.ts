import { NextFunction, Request, Response } from "express";
import { prop } from "lodash/fp";
import { GroupUser } from "src/models/GroupUser";
import {
  groupUserPermissionEnum,
  groupUserStatusEnum,
} from "src/types/GroupUser";
import { AUTH_ADMIN_ERROR_MSG, AuthError } from "src/utils/errors";

const requiredUser = (req: Request, _res: Response, next: NextFunction) => {
  if (prop("user", req)) {
    return next();
  }
  throw new AuthError();
};

const requiredGroupAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user = prop("user", req);
  const groupId = req.params.id;
  const adminInGroup = await GroupUser.findOne({
    userId: user._id,
    groupId,
    permission: groupUserPermissionEnum.Admin,
    status: groupUserStatusEnum.Accepted,
  }).lean();
  if (adminInGroup) {
    return next();
  }
  throw new AuthError();
};

const requiredAcceptedGroupUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user = prop("user", req);
  const groupId = req.params.id;
  const adminInGroup = await GroupUser.findOne({
    userId: user._id,
    groupId,
    permission: { $ne: null },
    status: groupUserStatusEnum.Accepted,
  }).lean();
  if (adminInGroup) {
    return next();
  }
  throw new AuthError();
};

const requiredAdminUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (prop("user.isAdmin", req)) {
    return next();
  }
  throw new AuthError(AUTH_ADMIN_ERROR_MSG);
};

export default {
  requiredUser,
  requiredAdminUser,
  requiredGroupAdmin,
  requiredAcceptedGroupUser,
};
