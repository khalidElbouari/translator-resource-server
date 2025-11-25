import { QuotaExceededError, ForbiddenError, ServiceUnavailableError } from "../../utils/errors.js";
import { getUserWithUsage } from "../services/usage.service.js";
import { checkFeatureAccess, getPlanConfigForUser, getUsageSnapshot } from "../services/plan.service.js";

export const enforcePlanAndQuota = (feature) => async (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    return next(new ServiceUnavailableError("User not resolved for plan enforcement."));
  }

  try {
    const user = await getUserWithUsage(userId);
    const planConfig = getPlanConfigForUser(user);
    const usage = getUsageSnapshot(user);
    const check = checkFeatureAccess({ planConfig, usage, feature });

    if (!check.allowed) {
      const ErrorCtor = check.reason === "feature_not_enabled" ? ForbiddenError : QuotaExceededError;
      return next(new ErrorCtor(check.message, { plan: user.plan, feature, remaining: check.remaining, limit: check.limit }));
    }

    req.userRecord = user;
    req.planConfig = planConfig;
    req.usageSnapshot = usage;
    next();
  } catch (err) {
    next(err);
  }
};
