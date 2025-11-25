import logger from "../../utils/logger.js";
import { AppError } from "../../utils/errors.js";

export const errorHandler = (err, req, res, next) => {
  const isAppError = err instanceof AppError;
  const status = err.statusCode || 500;
  const payload = {
    error: isAppError ? err.message : "Internal server error"
  };

  if (isAppError && err.details && Object.keys(err.details).length > 0) {
    payload.details = err.details;
  }

  if (!isAppError) {
    logger.error("Unhandled error", { error: err, path: req.originalUrl });
  } else {
    logger.warn(err.message, { statusCode: status, path: req.originalUrl, details: err.details });
  }

  res.status(status).json(payload);
};
