import { validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import BlogPost from "../models/BlogPost.js";
import { slugify } from "../utils/slugify.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

function sanitizeText(value = "") {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function sanitizeRichText(content = "") {
  return sanitizeHtml(content, {
    allowedTags: [
      "p",
      "b",
      "strong",
      "i",
      "em",
      "ul",
      "ol",
      "li",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "code",
      "pre",
      "br",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  }).trim();
}

async function normalizeBlogPayload(payload) {
  const title = sanitizeText(payload.title);
  return {
    title,
    slug: payload.slug ? slugify(payload.slug) : slugify(title),
    coverImage: payload.coverImage
      ? await uploadToCloudinary(payload.coverImage, "portfolio/blog")
      : "",
    content: sanitizeRichText(payload.content || ""),
    tags: Array.isArray(payload.tags) ? payload.tags.map((t) => sanitizeText(t)) : [],
  };
}

export async function createBlogPost(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const item = await BlogPost.create(await normalizeBlogPayload(req.body));
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function getBlogPosts(_req, res, next) {
  try {
    const items = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getBlogPostBySlug(req, res, next) {
  try {
    const item = await BlogPost.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ success: false, message: "Blog post not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateBlogPost(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const item = await BlogPost.findByIdAndUpdate(req.params.id, await normalizeBlogPayload(req.body), {
      new: true,
    });
    if (!item) return res.status(404).json({ success: false, message: "Blog post not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteBlogPost(req, res, next) {
  try {
    const item = await BlogPost.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Blog post not found" });
    res.json({ success: true, message: "Blog post deleted" });
  } catch (err) {
    next(err);
  }
}

