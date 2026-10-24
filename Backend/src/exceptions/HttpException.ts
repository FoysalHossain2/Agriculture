/**
 * Custom HTTP Exception class for consistent API error responses.
 */
export class HttpException extends Error {
  public statusCode: number;
  public message: string;
  public errors?: unknown[];

  constructor(statusCode: number, message: string, errors?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.name = 'HttpException';
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- Convenience Classes ---

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', errors?: unknown[]) {
    super(400, message, errors);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class InternalServerException extends HttpException {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}
