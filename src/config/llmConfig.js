// Central place to adjust prompts and model names.
// Update .env to override defaults without changing code.
import "dotenv/config";

export const TEXT_MODEL = process.env.HF_TEXT_MODEL || "deepseek-ai/DeepSeek-R1";
export const VISION_MODEL = process.env.HF_VISION_MODEL || "Qwen/Qwen2.5-VL-7B-Instruct";
export const GOOGLE_TEXT_MODEL = process.env.GOOGLE_TEXT_MODEL || "gemini-1.5-flash-001";

export const PROMPTS = {
  textTranslation: `Translate this text into Moroccan Darija using Arabic script only.
No English letters, no explanations, no comments.
Output only the translation:`,
  imageTranslation: "Translate the visible text in this image into Moroccan Darija using Arabic script only. No explanations."
};
