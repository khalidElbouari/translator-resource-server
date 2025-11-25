import { Router } from "express";
import { authenticateWithGoogle } from "../controllers/auth.controller.js";

const router = Router();

router.post("/google", authenticateWithGoogle);

export default router;
