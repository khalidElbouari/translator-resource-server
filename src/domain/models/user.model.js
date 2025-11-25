import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    dailyCount: { type: Number, default: 0 },
    featureCounts: { type: Map, of: Number, default: {} },
    lastRequestAt: { type: Date },
    lastResetAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, index: true, sparse: true },
    displayName: { type: String },
    avatarUrl: { type: String },
    authProvider: { type: String, default: "google" },
    plan: {
      type: String,
      enum: ["free", "premium", "enterprise"],
      default: "free"
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "cancelled", "none"],
      default: "none"
    },
    subscriptionProvider: { type: String },
    subscriptionId: { type: String },
    renewAt: { type: Date },
    usage: { type: usageSchema, default: () => ({}) },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
