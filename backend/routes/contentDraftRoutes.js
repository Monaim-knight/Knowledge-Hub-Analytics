import express from "express";
import { body, param } from "express-validator";
import {
  createDraft,
  deleteDraft,
  listDrafts,
  updateDraft,
} from "../controllers/contentDraftController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const validators = [
  body("title").isString().notEmpty(),
  body("body").optional().isString(),
  body("slug").optional().isString(),
  body("status").optional().isIn(["draft", "published"]),
  body("attachments").optional().isArray(),
];

router.get("/", requireAuth, listDrafts);
router.post("/", requireAuth, validators, createDraft);
router.put("/:id", requireAuth, [param("id").isMongoId(), ...validators], updateDraft);
router.delete("/:id", requireAuth, [param("id").isMongoId()], deleteDraft);

export default router;

