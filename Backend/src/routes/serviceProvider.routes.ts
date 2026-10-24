import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createServiceProviderProfile,
  getMyServiceProviderProfile,
  updateServiceProviderProfile,
  searchServices,
} from '../controllers/serviceProvider.controller';
import { USER_ROLES } from '../constants';

const router = Router();

// GET /api/v1/service-provider/search — public
router.get('/search', searchServices);

router.post(
  '/profile',
  authenticate,
  authorize(USER_ROLES.SERVICE_PROVIDER, USER_ROLES.ADMIN),
  createServiceProviderProfile
);

router.get(
  '/profile/me',
  authenticate,
  authorize(USER_ROLES.SERVICE_PROVIDER, USER_ROLES.ADMIN),
  getMyServiceProviderProfile
);

router.patch(
  '/profile/me',
  authenticate,
  authorize(USER_ROLES.SERVICE_PROVIDER, USER_ROLES.ADMIN),
  updateServiceProviderProfile
);

export default router;
