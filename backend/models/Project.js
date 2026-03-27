import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    thumbnail: { type: String, default: "" },
    github: { type: String, default: "" },
    liveDemo: { type: String, default: "" },
    images: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;

