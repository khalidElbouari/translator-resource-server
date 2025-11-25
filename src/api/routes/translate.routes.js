import { Router } from "express";
import { translate } from "../controllers/translate.controller.js";
import { validateBody } from "../../core/middlewares/validate.js";
import { translateSchema } from "../../core/validation/schemas.js";
import { requireUser } from "../../core/middlewares/requireUser.js";
import { trackUsage } from "../../core/middlewares/usageTracker.js";
import { enforcePlanAndQuota } from "../../core/middlewares/planGuard.js";

const router = Router();

router.post(
  "/",
  validateBody(translateSchema),
  requireUser,
  enforcePlanAndQuota("translate"),
  trackUsage("translate"),
  translate
);

export default router;
