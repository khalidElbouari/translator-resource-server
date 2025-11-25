import dotenv from "dotenv";

dotenv.config({ path: ".env", override: false, quiet: true });

const numberFromEnv = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: numberFromEnv(process.env.PORT, 3000),
  mongoUri: process.env.MONGODB_URI || "",
  mongoDbName: process.env.MONGODB_DB || undefined,
  redisUrl: process.env.REDIS_URL || "",
  corsOrigins: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  rateLimitWindowMs: numberFromEnv(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: numberFromEnv(process.env.RATE_LIMIT_MAX, 100),
  googleClientId:
    process.env.GOOGLE_CLIENT_ID ||
    "622427034276-kqbgku481gr3bd0i2v26adjo7i2m0a4j.apps.googleusercontent.com",
  paddleWebhookSecret: process.env.PADDLE_WEBHOOK_SECRET || ""
};

export const isProduction = env.nodeEnv === "production";
