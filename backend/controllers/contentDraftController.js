import { validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import ContentDraft from "../models/ContentDraft.js";
import { slugify } from "../utils/slugify.js";

function sanitizeText(value = "") {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function sanitizeBody(value = "") {
  return String(value || "").trim();
}

function normalizePayload(payload) {
  const title = sanitizeText(payload.title);
  const slug = payload.slug ? slugify(payload.slug) : slugify(title);
  return {
    title,
    slug,
    body: sanitizeBody(payload.body),
    status: payload.status === "published" ? "published" : "draft",
    attachments: Array.isArray(payload.attachments)
      ? payload.attachments.map((u) => sanitizeText(u)).filter(Boolean)
      : [],
  };
}

export async function listDrafts(_req, res, next) {
  try {
    const data = await ContentDraft.find().sort({ updatedAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createDraft(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const created = await ContentDraft.create(normalizePayload(req.body));
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function updateDraft(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const updates = normalizePayload(req.body);
    const item = await ContentDraft.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Content not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteDraft(req, res, next) {
  try {
    const item = await ContentDraft.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Content not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

