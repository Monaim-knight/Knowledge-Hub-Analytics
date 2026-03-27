import express from "express";
import { body, param } from "express-validator";
import {
  createCaseStudy,
  deleteCaseStudy,
  getCaseStudies,
  getCaseStudyBySlug,
  updateCaseStudy,
} from "../controllers/caseStudyController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const validators = [
  body("title").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("tags").optional().isArray(),
  body("sections").optional().isArray(),
];

router.get("/", getCaseStudies);
router.get("/:slug", [param("slug").isString().notEmpty()], getCaseStudyBySlug);
router.post("/", requireAuth, validators, createCaseStudy);
router.put("/:id", requireAuth, [param("id").isMongoId(), ...validators], updateCaseStudy);
router.delete("/:id", requireAuth, [param("id").isMongoId()], deleteCaseStudy);

export default router;

