import express from "express";
import { translateText, translateImage, translateTextGemini, translateImageGemini } from "../controllers/translate.controller.js";

const router = express.Router();

// Default to Hugging Face text; Gemini available at /gemini
router.post("/", translateText);
router.post("/gemini", translateTextGemini);
router.post("/image", translateImage);
router.post("/image/gemini", translateImageGemini);

export default router;
