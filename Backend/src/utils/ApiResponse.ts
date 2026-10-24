import { Response } from 'express';

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

/**
 * ApiResponse — Standardised success response wrapper.
 */
export class ApiResponse<T = unknown> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data?: T;
  public meta?: Meta;
  public timestamp: string;

  constructor(statusCode: number, message: string, data?: T, meta?: Meta) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Sends a standardised JSON API response.
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: Meta
): void => {
  const response = new ApiResponse<T>(statusCode, message, data, meta);
  res.status(statusCode).json(response);
};

export default sendResponse;
