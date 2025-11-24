import https from "https";
import { TEXT_MODEL, VISION_MODEL, PROMPTS } from "../config/llmConfig.js";

export const callHuggingFaceAPI = (text) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: TEXT_MODEL,
      messages: [
        {
          role: "user",
          content: `${PROMPTS.textTranslation}\n\n"${text}"`
        }
      ],
      stream: false,
      temperature: 0.1,
    });

    const options = {
      hostname: "router.huggingface.co",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
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
              message: parsed.error?.message || parsed.error || `HF API error (${apiRes.statusCode})`,
              status: apiRes.statusCode,
              body: parsed,
            };
            console.error("HF text API error:", err);
            return reject(err);
          }
          resolve(parsed.choices?.[0]?.message?.content || "");
        } catch (parseErr) {
          reject({ message: "Failed to parse API response", status: apiRes.statusCode, body });
        }
      });
    });

    apiReq.on("error", reject);
    apiReq.write(payload);
    apiReq.end();
  });
};

export const callHuggingFaceVisionAPI = ({ imageUrl, prompt }) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt || PROMPTS.imageTranslation },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      stream: false,
      temperature: 0.1
    });

    const options = {
      hostname: "router.huggingface.co",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      let body = "";
      apiRes.on("data", chunk => (body += chunk));
      apiRes.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          if (apiRes.statusCode >= 400 || parsed.error) {
            const err = {
              message: parsed.error?.message || parsed.error || `HF API error (${apiRes.statusCode})`,
              status: apiRes.statusCode,
              body: parsed,
            };
            console.error("HF vision API error:", err);
            return reject(err);
          }
          resolve(parsed.choices?.[0]?.message?.content || "");
        } catch (err) {
          reject({ message: "Failed to parse API response", status: apiRes.statusCode, body });
        }
      });
    });

    apiReq.on("error", reject);
    apiReq.write(payload);
    apiReq.end();
  });
};
