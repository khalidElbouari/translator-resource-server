import express from "express";
import { translateText, translateImage, translateTextGemini, translateImageGemini } from "../controllers/translate.controller.js";

const router = express.Router();

// Default to Hugging Face text; Gemini available at /gemini
//translateTextGemini , translateImageGemini , translateText, translateImage
router.post("/", translateTextGemini);
router.post("/image", translateImage);

export default router;
