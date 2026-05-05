import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    coverImage: { type: String, default: "" },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogPostSchema.virtual("attachments", {
  ref: "File",
  localField: "_id",
  foreignField: "parentId",
  match: { parentType: "blog" },
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;

