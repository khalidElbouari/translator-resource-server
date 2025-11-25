import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    feature: {
      type: String,
      enum: ["translate", "summarize", "explain", "rewrite", "form-assist"],
      required: true
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

activitySchema.index({ userId: 1, createdAt: -1 });

export const ActivityModel =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);
