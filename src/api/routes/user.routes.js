import { Router } from "express";
import { getStatus } from "../controllers/user.controller.js";
import { requireUser } from "../../core/middlewares/requireUser.js";

const router = Router();

router.get("/status", requireUser, getStatus);

export default router;
