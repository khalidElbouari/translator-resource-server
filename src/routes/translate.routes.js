import express from "express";
import { translateText, translateImage, translateTextGemini } from "../controllers/translate.controller.js";

const router = express.Router();

router.post("/", translateText);
router.post("/gemini", translateTextGemini);
router.post("/image", translateImage);

export default router;
