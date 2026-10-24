import { Response } from 'express';

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Sends a standardized JSON API response.
 */
const sendResponse = <T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  meta,
}: ApiResponseOptions<T>): void => {
  res.status(statusCode).json({
    success,
    statusCode,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
    timestamp: new Date().toISOString(),
  });
};

export default sendResponse;
