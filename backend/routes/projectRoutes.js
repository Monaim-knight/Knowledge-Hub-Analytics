import express from "express";
import { body, param } from "express-validator";
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const validators = [
  body("title").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("tags").optional().isArray(),
  body("images").optional().isArray(),
];

router.get("/", getProjects);
router.get("/:slug", [param("slug").isString().notEmpty()], getProjectBySlug);
router.post("/", requireAuth, validators, createProject);
router.put("/:id", requireAuth, [param("id").isMongoId(), ...validators], updateProject);
router.delete("/:id", requireAuth, [param("id").isMongoId()], deleteProject);

export default router;

