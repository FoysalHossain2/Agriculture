import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import fs from 'fs';
import logger from './logger';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and removes the temp file afterwards.
 * @param localFilePath - Absolute or relative path to the temp file on disk
 * @param folder        - Cloudinary folder to upload into (optional)
 * @returns The Cloudinary upload result, or null on failure
 */
export const uploadOnCloudinary = async (
  localFilePath: string,
  folder = 'agriculture'
): Promise<UploadApiResponse | null> => {
  if (!localFilePath) return null;

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder,
    });

    logger.info(`✅ Cloudinary upload success: ${result.secure_url}`);

    // Remove the locally saved temp file after a successful upload
    fs.unlinkSync(localFilePath);

    return result;
  } catch (error) {
    // Remove the locally saved temp file even if the upload failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    const err = error as UploadApiErrorResponse;
    logger.error(`❌ Cloudinary upload failed: ${err.message}`);
    return null;
  }
};

/**
 * Deletes a file from Cloudinary by its public_id.
 * @param publicId - The public_id returned when the file was uploaded
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`🗑️  Cloudinary file deleted: ${publicId}`);
  } catch (error) {
    const err = error as Error;
    logger.error(`❌ Cloudinary delete failed: ${err.message}`);
  }
};

export default cloudinary;
