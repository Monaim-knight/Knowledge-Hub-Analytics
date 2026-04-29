import express from "express";
import { uploadSingleFile, uploadSingleImage } from "../config/multer.js";
import { deleteMedia, listMedia, uploadFile, uploadImage } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, listMedia);

router.post("/", requireAuth, (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err) return next(err);
    return uploadImage(req, res, next);
  });
});

router.post("/file", requireAuth, (req, res, next) => {
  uploadSingleFile(req, res, (err) => {
    if (err) return next(err);
    return uploadFile(req, res, next);
  });
});

router.delete("/:id", requireAuth, deleteMedia);

export default router;

