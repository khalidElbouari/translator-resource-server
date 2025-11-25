import { getUserWithUsage, normalizeUsage } from "./usage.service.js";
import { getPlanConfigForUser, buildFeatureAvailability, getUsageSnapshot } from "./plan.service.js";

export const getUserStatus = async (userId) => {
  const user = await getUserWithUsage(userId);
  const planConfig = getPlanConfigForUser(user);
  const usage = getUsageSnapshot(user);

  const remainingQuota = {};
  for (const feature of Object.keys(planConfig.quota || {})) {
    const limit = planConfig.quota[feature];
    const used = usage.featureCounts[feature] || 0;
    remainingQuota[feature] = limit == null ? null : Math.max(limit - used, 0);
  }

  const availableFeatures = buildFeatureAvailability(planConfig, usage);

  return {
    userId,
    plan: user.plan,
    subscriptionStatus: user.subscriptionStatus || "none",
    renewAt: user.renewAt || null,
    usageToday: usage.dailyCount || 0,
    featureCounts: usage.featureCounts,
    remainingQuota,
    availableFeatures
  };
};
