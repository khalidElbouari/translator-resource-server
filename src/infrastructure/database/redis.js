import { createClient } from "redis";
import logger from "../../utils/logger.js";
import { env } from "../../config/env.js";

let client;

export const connectRedis = async () => {
  if (!env.redisUrl) {
    logger.warn("REDIS_URL not set; skipping Redis connection.");
    return null;
  }

  if (client) return client;

  client = createClient({ url: env.redisUrl });
  client.on("error", (err) => logger.error("Redis error", { error: err }));

  await client.connect();
  logger.info("Redis connected");
  return client;
};

export const getRedisClient = () => client;

export const disconnectRedis = async () => {
  if (!client) return;
  await client.quit();
  logger.info("Redis disconnected");
  client = null;
};
