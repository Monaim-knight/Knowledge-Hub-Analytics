import mongoose from "mongoose";

const contentDraftSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    body: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    attachments: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const ContentDraft = mongoose.model("ContentDraft", contentDraftSchema);
export default ContentDraft;

