import { Router } from "express";
import { summarize, explain, rewrite, assistForm } from "../controllers/content.controller.js";
import { validateBody } from "../../core/middlewares/validate.js";
import {
  summarizeSchema,
  explainSchema,
  rewriteSchema,
  formAssistSchema
} from "../../core/validation/schemas.js";
import { requireUser } from "../../core/middlewares/requireUser.js";
import { trackUsage } from "../../core/middlewares/usageTracker.js";
import { enforcePlanAndQuota } from "../../core/middlewares/planGuard.js";

const router = Router();

router.post(
  "/summarize",
  validateBody(summarizeSchema),
  requireUser,
  enforcePlanAndQuota("summarize"),
  trackUsage("summarize"),
  summarize
);
router.post(
  "/explain",
  validateBody(explainSchema),
  requireUser,
  enforcePlanAndQuota("explain"),
  trackUsage("explain"),
  explain
);
router.post(
  "/rewrite",
  validateBody(rewriteSchema),
  requireUser,
  enforcePlanAndQuota("rewrite"),
  trackUsage("rewrite"),
  rewrite
);
router.post(
  "/form-assist",
  validateBody(formAssistSchema),
  requireUser,
   enforcePlanAndQuota("form-assist"),
  trackUsage("form-assist"),
  assistForm
);

export default router;
