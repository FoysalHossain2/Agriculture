import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createFarmerProfile,
  getMyFarmerProfile,
  updateFarmerProfile,
} from '../controllers/farmer.controller';
import { USER_ROLES } from '../constants';

const router = Router();

router.post(
  '/profile',
  authenticate,
  authorize(USER_ROLES.FARMER, USER_ROLES.ADMIN),
  createFarmerProfile
);

router.get(
  '/profile/me',
  authenticate,
  authorize(USER_ROLES.FARMER, USER_ROLES.ADMIN),
  getMyFarmerProfile
);

router.patch(
  '/profile/me',
  authenticate,
  authorize(USER_ROLES.FARMER, USER_ROLES.ADMIN),
  updateFarmerProfile
);

export default router;
