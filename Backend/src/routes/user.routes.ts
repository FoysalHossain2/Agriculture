import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controllers';
import { USER_ROLES } from '../constants';

const router = Router();

// GET /api/v1/users/me — must be registered before /:id
router.get('/me', authenticate, getCurrentUser);

// GET /api/v1/users — Admin only
router.get('/', authenticate, authorize(USER_ROLES.ADMIN), getAllUsers);

// GET /api/v1/users/:id — Authenticated user
router.get('/:id', authenticate, getUserById);

// PUT /api/v1/users/:id — Authenticated user
router.put('/:id', authenticate, updateUser);

// DELETE /api/v1/users/:id — Admin only
router.delete('/:id', authenticate, authorize(USER_ROLES.ADMIN), deleteUser);

export default router;
