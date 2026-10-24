import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../constants';
import User from '../modules/user.model';

// ─────────────────────────────────────────────────────────────────────────────
// Augment Express Request type to carry `user` after authentication
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    username: string;
    role: UserRole;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// authenticate — verify JWT access token (cookie or Authorization header)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Middleware to verify JWT access token.
 * Checks HTTP-only cookie first (web clients), then Authorization header (mobile/API clients).
 * Attaches the full user document to `req.user` after verification.
 */
const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token — cookie takes priority over header
    const token: string | undefined =
      req.cookies?.accessToken ??
      req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return next(new ApiError(401, 'Access token missing. Please login.'));
    }

    // 2. Verify token signature & expiry
    const secret = process.env.JWT_SECRET;
    if (!secret) return next(new ApiError(500, 'Server misconfiguration: JWT_SECRET missing'));

    const decoded = jwt.verify(token, secret) as {
      _id: string;
      email: string;
      username: string;
      role: UserRole;
    };

    // 3. Fetch user from DB to ensure they still exist and are active
    const user = await User.findById(decoded._id).select('-password -refreshTokens');
    if (!user) {
      return next(new ApiError(401, 'User associated with this token no longer exists.'));
    }
    if (!user.isActive) {
      return next(new ApiError(403, 'Account is deactivated. Contact support.'));
    }

    // 4. Attach user to request
    req.user = {
      _id: (user._id as unknown as string).toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Access token has expired. Please refresh your session.'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid access token.'));
    }
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// authorize — restrict route access by RBAC role(s)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Middleware factory that restricts access to users whose role is in `roles`.
 *
 * Usage:
 *   router.get('/admin/dashboard', authenticate, authorize('admin'), handler)
 *   router.post('/farm', authenticate, authorize('farmer', 'admin'), handler)
 */
const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role(s): [${roles.join(', ')}]. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

export { authenticate, authorize };