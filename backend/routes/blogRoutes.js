import express from "express";
import { body, param } from "express-validator";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostBySlug,
  getBlogPosts,
  updateBlogPost,
} from "../controllers/blogController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const validators = [
  body("title").isString().notEmpty(),
  body("content").isString().notEmpty(),
  body("tags").optional().isArray(),
];

router.get("/", getBlogPosts);
router.get("/:slug", [param("slug").isString().notEmpty()], getBlogPostBySlug);
router.post("/", requireAuth, validators, createBlogPost);
router.put("/:id", requireAuth, [param("id").isMongoId(), ...validators], updateBlogPost);
router.delete("/:id", requireAuth, [param("id").isMongoId()], deleteBlogPost);

export default router;

