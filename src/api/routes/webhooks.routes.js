import { Router } from "express";
import { handlePaddleWebhook } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/paddle", handlePaddleWebhook);

export default router;
