import mongoose from "mongoose";
import logger from "../../utils/logger.js";
import { env } from "../../config/env.js";

let isConnected = false;

export const connectMongo = async () => {
  if (!env.mongoUri) {
    logger.warn("MONGODB_URI not set; skipping MongoDB connection.");
    return null;
  }

  if (isConnected) {
    return mongoose.connection;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(env.mongoUri, {
      dbName: env.mongoDbName || undefined
    });
    isConnected = true;
    logger.info("MongoDB connected");
    return mongoose.connection;
  } catch (err) {
    logger.error("Failed to connect to MongoDB", { error: err });
    throw err;
  }
};

export const disconnectMongo = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info("MongoDB disconnected");
};
