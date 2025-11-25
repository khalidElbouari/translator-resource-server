import { BadRequestError } from "../../utils/errors.js";
import { updateSubscriptionFromPaddle } from "../../core/services/subscription.service.js";

export const handlePaddleWebhook = async (req, res, next) => {
  try {
    const event = req.body || {};
    const eventType = event.event_type || event.alert_name || event.type;
    const userId =
      event?.data?.user_id ||
      event?.userId ||
      event?.data?.custom_data?.userId ||
      event?.custom_data?.userId;

    if (!userId) {
      throw new BadRequestError("Missing user identifier in Paddle webhook payload.");
    }

    await updateSubscriptionFromPaddle({
      userId,
      eventType,
      subscriptionId: event?.data?.id || event?.data?.subscription_id,
      renewAt: event?.data?.next_billed_at || event?.data?.next_bill_date
    });

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};
