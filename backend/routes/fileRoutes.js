import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { uploadAnyFilesForParent } from "../config/multer.js";
import {
  deleteFileById,
  listAllFiles,
  listFilesForParent,
  uploadFilesForParent,
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/library", requireAuth, listAllFiles);
router.get("/:parentType/:parentId", listFilesForParent);
router.post("/:parentType/:parentId", requireAuth, uploadAnyFilesForParent, uploadFilesForParent);
router.delete("/:id", requireAuth, deleteFileById);

export default router;

