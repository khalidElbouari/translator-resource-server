import { createApp } from "./app.js";
import { env } from "./config/env.js";
import logger from "./utils/logger.js";
import { connectMongo } from "./infrastructure/database/mongo.js";
import { connectRedis } from "./infrastructure/database/redis.js";

const bootstrap = async () => {
  try {
    await connectMongo();
  } catch (err) {
    logger.warn("Continuing without MongoDB connection", { error: err?.message });
  }

  try {
    await connectRedis();
  } catch (err) {
    logger.warn("Continuing without Redis connection", { error: err?.message });
  }

  const app = createApp();
  app.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
  });
};

bootstrap();
