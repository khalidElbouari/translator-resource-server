import { Router } from "express";
import translateRoutes from "./translate.routes.js";
import authRoutes from "./auth.routes.js";
import contentRoutes from "./content.routes.js";
import userRoutes from "./user.routes.js";
import webhookRoutes from "./webhooks.routes.js";

const router = Router();

router.use("/translate", translateRoutes);
router.use("/auth", authRoutes);
router.use("/content", contentRoutes);
router.use("/user", userRoutes);
router.use("/webhooks", webhookRoutes);

export default router;
