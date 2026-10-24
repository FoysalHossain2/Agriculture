import { Response } from 'express';
import FarmerProfile from '../modules/farmerProfile.model';
import { ApiError } from '../utils/ApiError';
import { sendResponse } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { HTTP_STATUS } from '../constants';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/farmer/profile
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new farmer profile for the authenticated user.
 * A user can only have one farmer profile.
 */
export const createFarmerProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    const existing = await FarmerProfile.findOne({ userId });
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Farmer profile already exists');
    }

    const profile = await FarmerProfile.create({ ...req.body, userId });

    sendResponse(res, HTTP_STATUS.CREATED, 'Farmer profile created successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/farmer/profile/me
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the authenticated farmer's own profile.
 */
export const getMyFarmerProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await FarmerProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Farmer profile not found');
    }

    sendResponse(res, HTTP_STATUS.OK, 'Farmer profile fetched successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/farmer/profile/me
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update the authenticated farmer's own profile.
 */
export const updateFarmerProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await FarmerProfile.findOneAndUpdate(
      { userId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Farmer profile not found');
    }

    sendResponse(res, HTTP_STATUS.OK, 'Farmer profile updated successfully', profile);
  }
);
