import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const updateUserToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  const userId = req.session.userId;

  try {
    await userService.updatePersonalAccessToken({
      id: userId!,
      personalAccessToken: token,
    });
    return res.send({ message: 'success' });
  } catch (error) {
    return res.status(500).send({ message: 'server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.session.userId;

  try {
    const user = await userService.findOneById(userId!);
    return res.send({ message: 'success', data: user });
  } catch (error) {
    return res.status(500).send({ message: 'server error' });
  }
};
