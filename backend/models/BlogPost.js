import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    coverImage: { type: String, default: "" },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;

