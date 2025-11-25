import logger from "../../utils/logger.js";
import { BadRequestError } from "../../utils/errors.js";
import { PROMPT_TEMPLATES } from "../../config/prompts.js";

export const translateText = async ({
  text,
  sourceLanguage = "auto",
  targetLanguage = "darija",
  tone = "neutral"
}) => {
  const trimmed = typeof text === "string" ? text.trim() : "";
  if (!trimmed) {
    throw new BadRequestError('Field "text" is required for translation.');
  }

  const translated = `Mock translation (${sourceLanguage} -> ${targetLanguage}, tone=${tone}): ${trimmed}`;
  logger.debug("Mock translation generated", {
    targetLanguage,
    sourceLanguage,
    tone,
    length: trimmed.length
  });

  return {
    original: trimmed,
    translated,
    provider: "mock",
    sourceLanguage,
    targetLanguage,
    tone,
    prompt: PROMPT_TEMPLATES.translate({ tone })
  };
};
