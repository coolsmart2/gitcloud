import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.getUser);

router.post('/token', userController.updateUserToken);

export default router;
