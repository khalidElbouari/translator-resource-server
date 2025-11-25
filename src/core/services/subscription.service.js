import { UserModel } from "../../domain/models/user.model.js";
import logger from "../../utils/logger.js";
import { DEFAULT_PLAN_KEY } from "../../config/plans.js";

const mapEventToPlan = (eventType) => {
  const normalized = (eventType || "").toLowerCase();
  const activateEvents = ["subscription_activated", "subscription_created", "subscription_updated", "subscription_payment_succeeded"];
  const cancelEvents = ["subscription_cancelled", "subscription_canceled", "subscription_paused", "subscription_paused_v2"];
  const expireEvents = ["subscription_expired", "subscription_payment_failed"];

  if (activateEvents.includes(normalized)) {
    return { plan: "premium", status: "active" };
  }
  if (cancelEvents.includes(normalized)) {
    return { plan: DEFAULT_PLAN_KEY, status: "cancelled" };
  }
  if (expireEvents.includes(normalized)) {
    return { plan: DEFAULT_PLAN_KEY, status: "expired" };
  }
  return null;
};

export const updateSubscriptionFromPaddle = async ({ userId, eventType, subscriptionId, renewAt }) => {
  const mapping = mapEventToPlan(eventType);
  if (!mapping) {
    logger.warn("Unhandled Paddle event type", { eventType });
    return null;
  }

  const update = {
    plan: mapping.plan,
    subscriptionStatus: mapping.status,
    subscriptionProvider: "paddle",
    subscriptionId: subscriptionId || undefined,
    renewAt: renewAt ? new Date(renewAt) : undefined
  };

  const user = await UserModel.findOneAndUpdate(
    { userId },
    { $set: update, $setOnInsert: { plan: mapping.plan } },
    { new: true, upsert: true }
  );

  logger.info("Updated subscription from Paddle", {
    userId,
    plan: user.plan,
    status: user.subscriptionStatus,
    renewAt: user.renewAt
  });
  return user;
};
