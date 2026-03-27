import { validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import CaseStudy from "../models/CaseStudy.js";
import { slugify } from "../utils/slugify.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

function sanitizeText(value = "") {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

async function normalizeCaseStudyPayload(payload) {
  const title = sanitizeText(payload.title);
  const description = sanitizeText(payload.description);
  const tags = Array.isArray(payload.tags) ? payload.tags.map((t) => sanitizeText(t)) : [];

  const heroImage = payload.heroImage
    ? await uploadToCloudinary(payload.heroImage, "portfolio/case-studies")
    : "";

  const sections = Array.isArray(payload.sections)
    ? await Promise.all(
        payload.sections.map(async (section) => ({
          heading: sanitizeText(section.heading),
          text: sanitizeText(section.text),
          image: section.image
            ? await uploadToCloudinary(section.image, "portfolio/case-studies")
            : "",
        }))
      )
    : [];

  return {
    title,
    slug: payload.slug ? slugify(payload.slug) : slugify(title),
    description,
    tags,
    heroImage,
    sections,
  };
}

export async function createCaseStudy(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const body = await normalizeCaseStudyPayload(req.body);
    const created = await CaseStudy.create(body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function getCaseStudies(_req, res, next) {
  try {
    const data = await CaseStudy.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCaseStudyBySlug(req, res, next) {
  try {
    const item = await CaseStudy.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ success: false, message: "Case study not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateCaseStudy(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const updates = await normalizeCaseStudyPayload(req.body);
    const item = await CaseStudy.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Case study not found" });

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteCaseStudy(req, res, next) {
  try {
    const item = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Case study not found" });
    res.json({ success: true, message: "Case study deleted" });
  } catch (err) {
    next(err);
  }
}

