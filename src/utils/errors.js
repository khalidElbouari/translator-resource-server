export class AppError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details = {}) {
    super(message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details = {}) {
    super(message, 404, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details = {}) {
    super(message, 403, details);
  }
}

export class QuotaExceededError extends AppError {
  constructor(message = "Quota exceeded", details = {}) {
    super(message, 402, details);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "Service unavailable", details = {}) {
    super(message, 503, details);
  }
}
