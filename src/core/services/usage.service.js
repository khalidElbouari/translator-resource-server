import { UserModel } from "../../domain/models/user.model.js";
import logger from "../../utils/logger.js";
import { DEFAULT_PLAN_KEY } from "../../config/plans.js";

export const normalizeUsage = (usage = {}) => {
  const now = new Date();
  const featureCounts = usage.featureCounts instanceof Map ? Object.fromEntries(usage.featureCounts) : usage.featureCounts || {};

  const lastReset = usage.lastResetAt ? new Date(usage.lastResetAt) : null;
  if (!lastReset || now.toDateString() !== lastReset.toDateString()) {
    return {
      dailyCount: 0,
      featureCounts: {},
      lastRequestAt: null,
      lastResetAt: now
    };
  }

  return {
    dailyCount: usage.dailyCount || 0,
    featureCounts,
    lastRequestAt: usage.lastRequestAt || null,
    lastResetAt: usage.lastResetAt || now
  };
};

export const getUserWithUsage = async (userId) => {
  const now = new Date();
  let user = await UserModel.findOne({ userId });
  if (!user) {
    user = new UserModel({
      userId,
      plan: DEFAULT_PLAN_KEY,
      usage: { dailyCount: 0, featureCounts: {}, lastResetAt: now }
    });
  }

  const normalizedUsage = normalizeUsage(user.usage);
  const needsSave =
    user.isNew ||
    normalizedUsage.dailyCount !== (user.usage?.dailyCount || 0) ||
    String(normalizedUsage.lastResetAt) !== String(user.usage?.lastResetAt);

  user.usage = normalizedUsage;
  if (needsSave) {
    await user.save();
  }
  return user;
};

export const incrementUsage = async ({ userId, feature }) => {
  const now = new Date();
  const user = await getUserWithUsage(userId);
  const usage = normalizeUsage(user.usage || {});

  usage.dailyCount = (usage.dailyCount || 0) + 1;
  usage.featureCounts = usage.featureCounts || {};
  usage.featureCounts[feature] = (usage.featureCounts[feature] || 0) + 1;
  usage.lastRequestAt = now;

  user.usage = usage;
  await user.save();

  logger.debug("Usage incremented", { userId, feature, dailyCount: usage.dailyCount });
  return usage;
};
