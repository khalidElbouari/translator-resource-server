import { incrementUsage } from "../services/usage.service.js";
import { ServiceUnavailableError } from "../../utils/errors.js";

export const trackUsage = (feature) => async (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    return next(new ServiceUnavailableError("User not resolved for usage tracking."));
  }

  try {
    await incrementUsage({ userId, feature });
    next();
  } catch (err) {
    next(err);
  }
};
