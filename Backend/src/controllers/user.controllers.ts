import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import sendResponse from '../utils/ApiResponse';
import { HTTP_STATUS, USER_ROLES, UserRole } from '../constants';
import User, { IUser } from '../modules/user.model';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { uploadOnCloudinary } from '../utils/cloudinary';

// ─────────────────────────────────────────────────────────────────────────────
// Cookie Options
// ─────────────────────────────────────────────────────────────────────────────

const COOKIE_OPTIONS = {
  httpOnly: true,                                    // JS cannot access the cookie
  secure: process.env.NODE_ENV === 'production',     // HTTPS only in prod
  sameSite: 'strict' as const,
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
};

const ACCESS_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 15 * 60 * 1000, // 15 minutes in ms
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper — generate both tokens & attach them as HTTP-only cookies
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a fresh access + refresh token pair for the given user,
 * persists the new refresh token to the DB (token rotation), and
 * attaches both tokens as HTTP-only cookies on the response.
 *
 * @returns { accessToken, refreshToken } — also returned for body use
 */
const generateAccessAndRefreshTokens = async (
  user: IUser,
  res: Response
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Persist the refresh token in DB for rotation/revocation
  // Re-fetch with +refreshTokens to avoid overwriting without selection
  await User.findByIdAndUpdate(user._id, {
    $push: { refreshTokens: refreshToken },
  });

  res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  return { accessToken, refreshToken };
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, fullname, password, role } = req.body;

  // ── 1. Validate required fields ──────────────────────────────────────────
  const missing = ['username', 'email', 'fullname', 'password'].filter(
    (field) => !req.body[field]?.toString().trim()
  );
  if (missing.length) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Missing required fields: ${missing.join(', ')}`
    );
  }

  // ── 2. Validate role if provided ─────────────────────────────────────────
  const allowedRoles = Object.values(USER_ROLES) as string[];
  const assignedRole: UserRole =
    role && allowedRoles.includes(role) ? (role as UserRole) : USER_ROLES.FARMER;

  // ── 3. Check for duplicate email / username ───────────────────────────────
  const existingUser = await User.findOne({
    $or: [
      { email: email.toLowerCase().trim() },
      { username: username.toLowerCase().trim() },
    ],
  });

  if (existingUser) {
    const field = existingUser.email === email.toLowerCase().trim() ? 'Email' : 'Username';
    throw new ApiError(HTTP_STATUS.CONFLICT, `${field} is already registered`);
  }

  // ── 4. Optional avatar upload ────────────────────────────────────────────
  let avatarUrl: string | null = null;
  if (req.file?.path) {
    const uploaded = await uploadOnCloudinary(req.file.path, 'agriculture/avatars');
    avatarUrl = uploaded?.secure_url ?? null;
  }

  // ── 5. Create user — password is hashed in the pre-save hook ─────────────
  const newUser = await User.create({
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    fullname: fullname.trim(),
    password,
    role: assignedRole,
    avatar: avatarUrl,
  });

  // ── 6. Return sanitized user (no password / tokens) ──────────────────────
  const createdUser = await User.findById(newUser._id);
  if (!createdUser) {
    throw new ApiError(HTTP_STATUS.INTERNAL_ERROR, 'User creation failed — please retry');
  }

  sendResponse(res, HTTP_STATUS.CREATED, 'Account created successfully', {
    user: createdUser,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // ── 1. Need at least one identifier ──────────────────────────────────────
  if (!email && !username) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Email or username is required'
    );
  }
  if (!password) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Password is required'
    );
  }

  // ── 2. Find user — select password explicitly (+password) ─────────────────
  const user = await User.findOne({
    $or: [
      ...(email ? [{ email: email.toLowerCase().trim() }] : []),
      ...(username ? [{ username: username.toLowerCase().trim() }] : []),
    ],
  }).select('+password +refreshTokens');

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid credentials'
    );
  }

  // ── 3. Verify account is active ───────────────────────────────────────────
  if (!user.isActive) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      'Your account has been deactivated. Contact support.'
    );
  }

  // ── 4. Validate password ──────────────────────────────────────────────────
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid credentials'
    );
  }

  // ── 5. Generate tokens & set cookies ─────────────────────────────────────
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user, res);

  // ── 6. Return user (without sensitive fields) ─────────────────────────────
  const loggedInUser = await User.findById(user._id); // clean fetch, no +password

  sendResponse(res, HTTP_STATUS.OK, `Welcome back, ${user.fullname}!`, {
    user: loggedInUser,
    accessToken,  // also return in body for mobile clients
    refreshToken,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Logout user (invalidate refresh token)
// @route   POST /api/v1/auth/logout
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────

export const logoutUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  const refreshToken: string | undefined = req.cookies?.refreshToken;

  if (userId) {
    if (refreshToken) {
      // Remove ONLY the token used in this session (multi-device safe)
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken },
      });
    } else {
      // Fallback: revoke ALL refresh tokens for this user
      await User.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
    }
  }

  // Clear both cookies
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);

  sendResponse(res, HTTP_STATUS.OK, 'Logged out successfully', null);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Refresh access token using a valid refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public (with valid refresh token cookie or body)
// ─────────────────────────────────────────────────────────────────────────────

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  // Accept token from cookie (web) or request body (mobile)
  const incomingRefreshToken: string | undefined =
    req.cookies?.refreshToken ?? req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Refresh token is missing'
    );
  }

  // ── 1. Verify the refresh token signature ─────────────────────────────────
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_ERROR,
      'Server misconfiguration'
    );
  }

  let decoded: jwt.JwtPayload;
  try {
    decoded = jwt.verify(incomingRefreshToken, refreshSecret) as jwt.JwtPayload;
  } catch {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid or expired refresh token'
    );
  }

  // ── 2. Find user & confirm token exists in DB (rotation check) ─────────────
  const user = await User.findById(decoded._id).select('+refreshTokens');
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'User not found'
    );
  }

  const tokenExists = user.refreshTokens.includes(incomingRefreshToken);
  if (!tokenExists) {
    // Potential token reuse attack — revoke all tokens
    await User.findByIdAndUpdate(user._id, { $set: { refreshTokens: [] } });
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Refresh token has already been used or revoked. Please login again.'
    );
  }

  // ── 3. Token rotation — remove old, issue new pair ───────────────────────
  await User.findByIdAndUpdate(user._id, {
    $pull: { refreshTokens: incomingRefreshToken },
  });

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user, res);

  sendResponse(res, HTTP_STATUS.OK, 'Tokens refreshed successfully', {
    accessToken,
    refreshToken: newRefreshToken,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get currently authenticated user
// @route   GET /api/v1/users/me
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────

export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  sendResponse(res, HTTP_STATUS.OK, 'Current user fetched successfully', user);
});

// ─────────────────────────────────────────────────────────────────────────────
// Generic CRUD handlers (for admin / authenticated user routes)
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find({ isActive: true }).select('-__v');
  sendResponse(res, HTTP_STATUS.OK, 'Users fetched successfully', users);
});

// @desc    Get a single user by ID
// @route   GET /api/v1/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'User ID is required'
    );
  }

  const user = await User.findById(id).select('-__v');
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      'User not found'
    );
  }

  sendResponse(res, HTTP_STATUS.OK, 'User fetched successfully', user);
});

// @desc    Update a user by ID
// @route   PUT /api/v1/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'User ID is required'
    );
  }

  // Block direct password or token changes through this route
  const { password, refreshTokens, ...safeFields } = req.body;
  void password; void refreshTokens; // intentionally ignored

  const user = await User.findByIdAndUpdate(id, safeFields, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      'User not found'
    );
  }

  sendResponse(res, HTTP_STATUS.OK, 'User updated successfully', user);
});

// @desc    Delete a user by ID
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'User ID is required'
    );
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      'User not found'
    );
  }

  sendResponse(res, HTTP_STATUS.OK, 'User deleted successfully', null);
});


export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
};