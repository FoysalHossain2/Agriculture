import { Response } from 'express';
import ServiceProviderProfile from '../modules/serviceProviderProfile.model';
import { ApiError } from '../utils/ApiError';
import { sendResponse } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { HTTP_STATUS } from '../constants';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/service-provider/profile
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new service provider profile for the authenticated user.
 * A user can only have one service provider profile.
 */
export const createServiceProviderProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    const existing = await ServiceProviderProfile.findOne({ userId });
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Service provider profile already exists');
    }

    const profile = await ServiceProviderProfile.create({ ...req.body, userId });

    sendResponse(res, HTTP_STATUS.CREATED, 'Service provider profile created successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/service-provider/profile/me
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the authenticated service provider's own profile.
 */
export const getMyServiceProviderProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await ServiceProviderProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Service provider profile not found');
    }

    sendResponse(res, HTTP_STATUS.OK, 'Service provider profile fetched successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/service-provider/profile/me
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update the authenticated service provider's own profile.
 */
export const updateServiceProviderProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await ServiceProviderProfile.findOneAndUpdate(
      { userId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Service provider profile not found');
    }

    sendResponse(res, HTTP_STATUS.OK, 'Service provider profile updated successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/service-provider/search  (Public)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Public endpoint to search approved service providers.
 * Supports filtering by service type, district, and upazila.
 *
 * Query params:
 *   - type      : IServiceItem['type']
 *   - district  : string
 *   - upazila   : string
 */
export const searchServices = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { type, district, upazila } = req.query;

    // Only surface approved providers to the public
    const filter: Record<string, unknown> = { isApproved: true };
    if (type) filter['services.type'] = type;
    if (district) filter['district'] = district;
    if (upazila) filter['upazila'] = upazila;

    const profiles = await ServiceProviderProfile.find(filter)
      .populate('userId', 'fullname phone avatar')
      .select('-documents');

    sendResponse(res, HTTP_STATUS.OK, 'Service providers fetched successfully', profiles);
  }
);
