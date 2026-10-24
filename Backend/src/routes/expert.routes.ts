import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createExpertProfile,
  getMyExpertProfile,
  updateExpertProfile,
  getApprovedExperts,
} from '../controllers/expert.controller';
import { USER_ROLES } from '../constants';

const router = Router();

// GET /api/v1/expert — public list of approved experts
router.get('/', getApprovedExperts);

router.post(
  '/profile',
  authenticate,
  authorize(USER_ROLES.AGRICULTURE_EXPERT, USER_ROLES.ADMIN),
  createExpertProfile
);

router.get(
  '/profile/me',
  authenticate,
  authorize(USER_ROLES.AGRICULTURE_EXPERT, USER_ROLES.ADMIN),
  getMyExpertProfile
);

router.patch(
  '/profile/me',
  authenticate,
  authorize(USER_ROLES.AGRICULTURE_EXPERT, USER_ROLES.ADMIN),
  updateExpertProfile
);

export default router;
