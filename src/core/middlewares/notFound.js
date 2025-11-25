import { NotFoundError } from "../../utils/errors.js";

export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route not found: ${req.originalUrl}`));
};
