import https from "https";
import { PROMPTS } from "../config/llmConfig.js";

const GOOGLE_HOST = "generativelanguage.googleapis.com";

export const callGeminiTextAPI = (text) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const model = process.env.GOOGLE_TEXT_MODEL || "gemini-1.5-flash-latest";
    if (!apiKey) {
      return reject({ message: "Missing GOOGLE_API_KEY", status: 400 });
    }

    const prompt = `${PROMPTS.textTranslation}\n\n"${text}"`;
    const payload = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const options = {
      hostname: GOOGLE_HOST,
      port: 443,
      path: `/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
            console.error("Gemini API error:", err);
            return reject(err);
          }
          const candidates = parsed.candidates || [];
          const firstText = candidates[0]?.content?.parts?.[0]?.text || "";
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
