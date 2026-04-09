import express from "express";
import { uploadSingleImage } from "../config/multer.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err) return next(err);
    return uploadImage(req, res, next);
  });
});

export default router;

