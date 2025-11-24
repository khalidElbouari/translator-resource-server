import https from "https";
import { PROMPTS, GOOGLE_TEXT_MODEL } from "../config/llmConfig.js";

const GOOGLE_HOST = "generativelanguage.googleapis.com";

const callGemini = ({ model, contents }) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return reject({ message: "Missing GOOGLE_API_KEY", status: 400 });

    const payload = JSON.stringify({ contents });
    const options = {
      hostname: GOOGLE_HOST,
      port: 443,
      path: `/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const apiReq = https.request(options, (apiRes) => {
      let body = "";
      apiRes.on("data", chunk => (body += chunk));
      apiRes.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          if (apiRes.statusCode >= 400 || parsed.error) {
            const err = {
              message: parsed.error?.message || parsed.error?.status || `Gemini API error (${apiRes.statusCode})`,
              status: apiRes.statusCode,
              body: parsed,
            };
            console.error(`Gemini API error (${model}):`, err);
            return reject(err);
          }
          const firstText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
          resolve(firstText);
        } catch (err) {
          reject({ message: "Failed to parse Gemini response", status: apiRes.statusCode, body });
        }
      });
    });

    apiReq.on("error", reject);
    apiReq.write(payload);
    apiReq.end();
  });
};

export const callGeminiTextAPI = (text) => {
  const prompt = `${PROMPTS.textTranslation}\n\n"${text}"`;
  const contents = [{ parts: [{ text: prompt }] }];
  return callGemini({ model: GOOGLE_TEXT_MODEL, contents });
};

export const callGeminiVisionAPI = ({ imageBase64, mimeType = "image/png" }) => {
  const contents = [
    {
      parts: [
        { text: PROMPTS.imageTranslation },
        {
          inline_data: {
            mime_type: mimeType,
            data: imageBase64
          }
        }
      ]
    }
  ];
  return callGemini({ model: GOOGLE_TEXT_MODEL, contents });
};
