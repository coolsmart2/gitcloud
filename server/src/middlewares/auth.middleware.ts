import { NextFunction, Request, Response } from 'express';

export const checkSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session.userId as number;
  if (!userId) {
    return res.status(404).send({ message: 'auth error' });
  }
  return next();
};
