import { translateText } from "../../core/services/translation.service.js";

export const translate = async (req, res, next) => {
  try {
    const { text, sourceLanguage, targetLanguage, tone } = req.body;
    const result = await translateText({ text, sourceLanguage, targetLanguage, tone });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};
