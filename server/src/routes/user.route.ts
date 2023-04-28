import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.get('/', userController.getUser);

router.post(
  '/token',
  authMiddleware.checkSession,
  userController.updateUserToken
);

export default router;
