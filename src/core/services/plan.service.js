import { PLAN_CONFIG, DEFAULT_PLAN_KEY } from "../../config/plans.js";
import { normalizeUsage } from "./usage.service.js";

export const getPlanConfigForUser = (user) => {
  const planKey = user?.plan || DEFAULT_PLAN_KEY;
  return PLAN_CONFIG[planKey] || PLAN_CONFIG[DEFAULT_PLAN_KEY];
};

export const getUsageSnapshot = (user) => {
  const usage = normalizeUsage(user?.usage || {});
  const featureCounts = usage.featureCounts instanceof Map ? Object.fromEntries(usage.featureCounts) : usage.featureCounts || {};
  return {
    dailyCount: usage.dailyCount || 0,
    featureCounts
  };
};

export const checkFeatureAccess = ({ planConfig, usage, feature }) => {
  const featureConfig = planConfig.features?.[feature];
  if (!featureConfig?.enabled) {
    return {
      allowed: false,
      reason: "feature_not_enabled",
      message: "Feature requires an upgraded plan.",
      remaining: 0,
      limit: 0
    };
  }

  const limit = planConfig.quota?.[feature];
  if (limit == null) {
    return { allowed: true, remaining: null, limit: null };
  }

  const used = usage.featureCounts?.[feature] || 0;
  const remaining = Math.max(limit - used, 0);

  if (remaining <= 0) {
    return {
      allowed: false,
      reason: "quota_exceeded",
      message: "Daily quota reached. Upgrade to continue.",
      remaining: 0,
      limit
    };
  }

  return { allowed: true, remaining, limit };
};

export const buildFeatureAvailability = (planConfig, usage) => {
  const result = {};
  for (const feature of Object.keys(planConfig.features || {})) {
    const check = checkFeatureAccess({ planConfig, usage, feature });
    result[feature] = {
      enabled: planConfig.features[feature].enabled,
      limit: check.limit,
      remaining: check.remaining
    };
  }
  return result;
};
