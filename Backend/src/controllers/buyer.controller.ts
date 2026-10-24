import { Response } from 'express';
import BuyerProfile from '../modules/buyerProfile.model';
import { ApiError } from '../utils/ApiError';
import { sendResponse } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { HTTP_STATUS } from '../constants';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/buyer/profile
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new buyer profile for the authenticated user.
 * A user can only have one buyer profile.
 */
export const createBuyerProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    const existing = await BuyerProfile.findOne({ userId });
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Buyer profile already exists');
    }

    const profile = await BuyerProfile.create({ ...req.body, userId });

    sendResponse(res, HTTP_STATUS.CREATED, 'Buyer profile created successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/buyer/profile/me
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the authenticated buyer's own profile.
 */
export const getMyBuyerProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await BuyerProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Buyer profile not found');
    }

    sendResponse(res, HTTP_STATUS.OK, 'Buyer profile fetched successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/buyer/profile/me
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update the authenticated buyer's own profile.
 */
export const updateBuyerProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await BuyerProfile.findOneAndUpdate(
      { userId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Buyer profile not found');
    }

    sendResponse(res, HTTP_STATUS.OK, 'Buyer profile updated successfully', profile);
  }
);
