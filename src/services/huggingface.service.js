import https from "https";

export const callHuggingFaceAPI = (text) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: "deepseek-ai/DeepSeek-R1:fastest",
      messages: [
        {
          role: "user",
          content: `Translate this text into Moroccan Darija using Arabic script only.
                    No English letters, no explanations, no comments.
                    Output only the translation:\n\n"${text}"`
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
          resolve(parsed.choices?.[0]?.message?.content || "");
        } catch (parseErr) {
          reject("Failed to parse API response");
        }
      });
    });

    apiReq.on("error", reject);
    apiReq.write(payload);
    apiReq.end();
  });
};
