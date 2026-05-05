import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    parentType: {
      type: String,
      required: true,
      enum: ["case-study", "project", "blog"],
      trim: true,
    },
    parentModel: {
      type: String,
      required: true,
      enum: ["CaseStudy", "Project", "BlogPost"],
    },
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "parentModel", index: true },
    fileName: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileType: { type: String, default: "", trim: true },
    fileSize: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const File = mongoose.model("File", fileSchema);
export default File;

