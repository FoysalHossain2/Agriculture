import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createBuyerProfile,
  getMyBuyerProfile,
  updateBuyerProfile,
} from '../controllers/buyer.controller';
import { USER_ROLES } from '../constants';

const router = Router();

router.post(
  '/profile',
  authenticate,
  authorize(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  createBuyerProfile
);

router.get(
  '/profile/me',
  authenticate,
  authorize(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  getMyBuyerProfile
);

router.patch(
  '/profile/me',
  authenticate,
  authorize(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  updateBuyerProfile
);

export default router;
