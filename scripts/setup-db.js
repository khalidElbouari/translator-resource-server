import "dotenv/config";
import { connectMongo, disconnectMongo } from "../src/infrastructure/database/mongo.js";
import { UserModel } from "../src/domain/models/user.model.js";
import { ProfileModel } from "../src/domain/models/profile.model.js";
import { ActivityModel } from "../src/domain/models/activity.model.js";

const run = async () => {
  const conn = await connectMongo();
  if (!conn) {
    throw new Error("MONGODB_URI is not set or MongoDB connection failed.");
  }

  // Ensure collections exist and indexes are applied
  const models = [UserModel, ProfileModel, ActivityModel];
  for (const model of models) {
    await model.createCollection();
    await model.syncIndexes();
  }

  console.log("MongoDB setup complete: User, Profile, and Activity collections are ready.");
};

run()
  .catch((err) => {
    console.error("DB setup failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectMongo();
  });
