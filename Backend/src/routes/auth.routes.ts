import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer.middleware';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from '../controllers/user.controllers';

const router = Router();

// POST /api/v1/auth/register
router.route('/register').post(upload.single('avatar'), registerUser);

// POST /api/v1/auth/login
router.route('/login').post(loginUser);

// POST /api/v1/auth/logout
router.route('/logout').post(authenticate, logoutUser);

// POST /api/v1/auth/refresh-token
router.route('/refresh-token').post(refreshAccessToken);


export default router;