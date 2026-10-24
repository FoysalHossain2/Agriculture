import { Response } from 'express';
import ExpertProfile from '../modules/expertProfile.model';
import { ApiError } from '../utils/ApiError';
import { sendResponse } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { HTTP_STATUS } from '../constants';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/expert/profile
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new expert profile for the authenticated user.
 * A user can only have one expert profile.
 */
export const createExpertProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    const existing = await ExpertProfile.findOne({ userId });
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Expert profile already exists');
    }

    const profile = await ExpertProfile.create({ ...req.body, userId });

    sendResponse(res, HTTP_STATUS.CREATED, 'Expert profile created successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/expert/profile/me
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the authenticated expert's own profile.
 */
export const getMyExpertProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await ExpertProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Expert profile not found');
    }

    sendResponse(res, HTTP_STATUS.OK, 'Expert profile fetched successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/expert/profile/me
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update the authenticated expert's own profile.
 */
export const updateExpertProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await ExpertProfile.findOneAndUpdate(
      { userId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Expert profile not found');
    }

    sendResponse(res, HTTP_STATUS.OK, 'Expert profile updated successfully', profile);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/expert  (Public)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Public endpoint to list approved experts who are available for chat.
 *
 * Query params:
 *   - specialization : string (e.g. 'crop_disease', 'soil', 'pest', 'organic')
 */
export const getApprovedExperts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { specialization } = req.query;

    const filter: Record<string, unknown> = {
      isApproved: true,
      availableForChat: true,
    };

    if (specialization) filter['specialization'] = specialization;

    const experts = await ExpertProfile.find(filter)
      .populate('userId', 'fullname phone avatar')
      .select('-documents');

    sendResponse(res, HTTP_STATUS.OK, 'Approved experts fetched successfully', experts);
  }
);
