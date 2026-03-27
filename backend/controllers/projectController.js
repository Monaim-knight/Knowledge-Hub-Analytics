import { validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import Project from "../models/Project.js";
import { slugify } from "../utils/slugify.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

function sanitizeText(value = "") {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

async function normalizeProjectPayload(payload) {
  const title = sanitizeText(payload.title);
  return {
    title,
    slug: payload.slug ? slugify(payload.slug) : slugify(title),
    description: sanitizeText(payload.description),
    tags: Array.isArray(payload.tags) ? payload.tags.map((t) => sanitizeText(t)) : [],
    thumbnail: payload.thumbnail
      ? await uploadToCloudinary(payload.thumbnail, "portfolio/projects")
      : "",
    github: sanitizeText(payload.github || ""),
    liveDemo: sanitizeText(payload.liveDemo || ""),
    images: Array.isArray(payload.images)
      ? await Promise.all(
          payload.images.map((img) => uploadToCloudinary(img, "portfolio/projects"))
        )
      : [],
  };
}

export async function createProject(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const item = await Project.create(await normalizeProjectPayload(req.body));
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function getProjects(_req, res, next) {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getProjectBySlug(req, res, next) {
  try {
    const item = await Project.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const updates = await normalizeProjectPayload(req.body);
    const item = await Project.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    next(err);
  }
}

