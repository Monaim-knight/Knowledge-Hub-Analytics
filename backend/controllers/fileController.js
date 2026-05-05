import path from "node:path";
import { unlink } from "node:fs/promises";
import File from "../models/File.js";
import CaseStudy from "../models/CaseStudy.js";
import Project from "../models/Project.js";
import BlogPost from "../models/BlogPost.js";

const parentConfig = {
  "case-study": { model: CaseStudy, segment: "case-studies", modelName: "CaseStudy" },
  project: { model: Project, segment: "projects", modelName: "Project" },
  blog: { model: BlogPost, segment: "blog-posts", modelName: "BlogPost" },
};

function getBase(req) {
  const fromEnv = process.env.BACKEND_PUBLIC_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

async function ensureParentExists(parentType, parentId) {
  const conf = parentConfig[parentType];
  if (!conf) return false;
  const exists = await conf.model.exists({ _id: parentId });
  return Boolean(exists);
}

export async function uploadFilesForParent(req, res, next) {
  try {
    const { parentType, parentId } = req.params;
    const conf = parentConfig[parentType];
    if (!conf) {
      return res.status(400).json({ success: false, message: "Invalid parent type" });
    }
    if (!(await ensureParentExists(parentType, parentId))) {
      return res.status(404).json({ success: false, message: "Parent record not found" });
    }
    if (!Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded (field: files)" });
    }

    const base = getBase(req);
    const records = req.files.map((file) => ({
      parentType,
      parentModel: conf.modelName,
      parentId,
      fileName: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype || "",
      fileSize: file.size || 0,
      fileUrl: `${base}/uploads/${conf.segment}/${parentId}/${file.filename}`,
    }));

    const created = await File.insertMany(records);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return next(err);
  }
}

export async function listFilesForParent(req, res, next) {
  try {
    const { parentType, parentId } = req.params;
    if (!parentConfig[parentType]) {
      return res.status(400).json({ success: false, message: "Invalid parent type" });
    }
    const data = await File.find({ parentType, parentId }).sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

export async function listAllFiles(_req, res, next) {
  try {
    const data = await File.find().sort({ createdAt: -1 }).limit(500);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

export async function deleteFileById(req, res, next) {
  try {
    const item = await File.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "File not found" });

    const conf = parentConfig[item.parentType];
    if (conf?.segment) {
      const filePath = path.resolve("uploads", conf.segment, item.parentId, item.fileName);
      try {
        await unlink(filePath);
      } catch {
        // no-op when missing
      }
    }

    await File.findByIdAndDelete(item._id);
    return res.json({ success: true, message: "File deleted" });
  } catch (err) {
    return next(err);
  }
}

