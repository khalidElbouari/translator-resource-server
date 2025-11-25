import { BadRequestError } from "../../utils/errors.js";

export const requireUser = (req, res, next) => {
  const userId =
    req.headers["x-user-id"] ||
    req.validatedBody?.userId ||
    req.body?.userId ||
    req.user?.userId;

  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    return next(new BadRequestError('Missing "userId". Provide via header "x-user-id" or body.'));
  }

  req.user = { ...(req.user || {}), userId: userId.trim() };
  next();
};
