import { Request, Response } from 'express';
import { prop } from 'lodash/fp';

export const UserController = {
  getMe: async (req: Request, res: Response) => {
    const user = prop("user", req);
    res.send({ user });
  },
};
