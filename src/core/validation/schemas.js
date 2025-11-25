import { z } from "zod";

export const translateSchema = z.object({
  text: z.string().trim().min(1, '"text" is required'),
  sourceLanguage: z.string().trim().min(1).optional(),
  targetLanguage: z.string().trim().min(1).optional(),
  tone: z.string().trim().min(1).optional(),
  userId: z.string().trim().min(1).optional()
});

export const summarizeSchema = z.object({
  text: z.string().trim().min(1, '"text" is required'),
  mode: z.enum(["bullet", "academic", "tldr"]).optional(),
  targetLanguage: z.string().trim().min(1).optional(),
  userId: z.string().trim().min(1).optional()
});

export const explainSchema = z.object({
  text: z.string().trim().min(1, '"text" is required'),
  level: z.enum(["simple", "intermediate", "professional", "academic"]).optional(),
  targetLanguage: z.string().trim().min(1).optional(),
  userId: z.string().trim().min(1).optional()
});

export const rewriteSchema = z.object({
  text: z.string().trim().min(1, '"text" is required'),
  tone: z.string().trim().min(1).optional(),
  targetLanguage: z.string().trim().min(1).optional(),
  userId: z.string().trim().min(1).optional()
});

export const formAssistSchema = z.object({
  text: z.string().trim().min(1, '"text" is required'),
  fieldLabel: z.string().trim().min(1, '"fieldLabel" is required'),
  formType: z.string().trim().optional(),
  profileHints: z.record(z.any()).optional(),
  userId: z.string().trim().min(1).optional()
});
