import express from "express";
import { translateText, translateImage } from "../controllers/translate.controller.js";

const router = express.Router();

router.post("/", translateText);
router.post("/image", translateImage);

export default router;
