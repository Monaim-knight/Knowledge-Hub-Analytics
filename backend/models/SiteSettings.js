import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true, trim: true },
    profilePhotoUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true, versionKey: false }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
export default SiteSettings;
