import logger from "../../utils/logger.js";
import { BadRequestError } from "../../utils/errors.js";
import { PROMPT_TEMPLATES } from "../../config/prompts.js";

const ensureText = (text) => {
  const trimmed = typeof text === "string" ? text.trim() : "";
  if (!trimmed) {
    throw new BadRequestError('Field "text" is required.');
  }
  return trimmed;
};

export const summarizeContent = async ({ text, mode = "bullet", targetLanguage }) => {
  const content = ensureText(text);
  const summary = `Mock summary (${mode}${targetLanguage ? ` -> ${targetLanguage}` : ""}): ${content.slice(0, 120)}...`;
  logger.debug("Generated mock summary", { mode, targetLanguage });
  return {
    mode,
    targetLanguage: targetLanguage || null,
    prompt: PROMPT_TEMPLATES.summarize({ mode }),
    summary
  };
};

export const explainContent = async ({ text, level = "simple", targetLanguage }) => {
  const content = ensureText(text);
  const explanation = `Mock explanation (${level}${targetLanguage ? ` -> ${targetLanguage}` : ""}): ${content.slice(0, 120)}...`;
  logger.debug("Generated mock explanation", { level, targetLanguage });
  return {
    level,
    targetLanguage: targetLanguage || null,
    prompt: PROMPT_TEMPLATES.explain({ level }),
    explanation
  };
};

export const rewriteContent = async ({ text, tone = "formal", targetLanguage }) => {
  const content = ensureText(text);
  const rewritten = `Mock rewrite (${tone}${targetLanguage ? ` -> ${targetLanguage}` : ""}): ${content.slice(0, 120)}...`;
  logger.debug("Generated mock rewrite", { tone, targetLanguage });
  return {
    tone,
    targetLanguage: targetLanguage || null,
    prompt: PROMPT_TEMPLATES.rewrite({ tone }),
    rewritten
  };
};

export const formAssist = async ({ text, fieldLabel, formType, profileHints }) => {
  const content = ensureText(text);
  if (!fieldLabel) {
    throw new BadRequestError('Field "fieldLabel" is required.');
  }

  const suggestion = `Mock form suggestion for "${fieldLabel}"${formType ? ` (${formType})` : ""}: ${content.slice(0, 120)}...`;
  logger.debug("Generated mock form suggestion", { fieldLabel, formType });
  return {
    fieldLabel,
    formType: formType || null,
    profileHints: profileHints || null,
    prompt: PROMPT_TEMPLATES.formAssist({ fieldLabel }),
    suggestion
  };
};
