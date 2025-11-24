import { callHuggingFaceAPI } from "../services/huggingface.service.js";
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
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};
