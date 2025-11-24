import { callHuggingFaceAPI, callHuggingFaceVisionAPI } from "../services/huggingface.service.js";
import { callGeminiTextAPI } from "../services/google.service.js";
import { cleanAIResponse } from "../utils/cleanResponse.js";

export const translateText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing "text" in request body' });

    const rawResponse = await callHuggingFaceAPI(text);
    const translated = cleanAIResponse(rawResponse);

    res.json({ original: text, translated });
  } catch (err) {
    console.error("Controller error:", err);
    const status = err?.status || 500;
    res.status(status).json({ error: err?.message || "Internal server error", details: err });
  }
};

export const translateTextGemini = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing "text" in request body' });

    const rawResponse = await callGeminiTextAPI(text);
    const translated = cleanAIResponse(rawResponse);

    res.json({ original: text, translated, provider: "gemini" });
  } catch (err) {
    console.error("Gemini controller error:", err);
    const status = err?.status || 500;
    res.status(status).json({ error: err?.message || "Internal server error", details: err });
  }
};

export const translateImage = async (req, res) => {
  try {
    const { imageBase64, imageUrl } = req.body;
    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ error: 'Provide "imageBase64" or "imageUrl" in request body' });
    }

    const resolvedImageUrl = imageUrl || buildDataUrl(imageBase64);
    if (!resolvedImageUrl) {
      return res.status(400).json({ error: "Invalid image payload" });
    }

    const prompt = "Translate the visible text in this image into Moroccan Darija using Arabic script only. No explanations.";
    const rawResponse = await callHuggingFaceVisionAPI({ imageUrl: resolvedImageUrl, prompt });
    const cleaned = cleanAIResponse(rawResponse);
    const translated = cleaned || rawResponse?.trim?.() || "";

    if (!translated) {
      console.warn("Vision model returned empty translation. Raw response:", rawResponse);
      return res.status(502).json({ error: "Translation returned empty", raw: rawResponse || null });
    }

    res.json({ source: imageUrl ? "url" : "base64", translated, raw: rawResponse });
  } catch (err) {
    console.error("Image translation error:", err);
    const message = err?.message || "Internal server error";
    const status = err?.status || (err?.code === "model_not_found" ? 400 : 500);
    res.status(status).json({ error: message, details: err });
  }
};

const buildDataUrl = (base64) => {
  if (!base64 || typeof base64 !== "string") return null;
  const trimmed = base64.trim();
  if (trimmed.startsWith("data:image")) return trimmed;
  // Default to PNG if no mime provided
  return `data:image/png;base64,${trimmed}`;
};
