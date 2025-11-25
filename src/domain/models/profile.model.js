import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    email: { type: String },
    locale: { type: String },
    preferredLanguages: [{ type: String }],
    preferredTone: { type: String },
    savedSnippets: [
      {
        key: { type: String },
        value: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const ProfileModel =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);
