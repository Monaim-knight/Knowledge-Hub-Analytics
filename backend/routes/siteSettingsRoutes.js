import express from "express";
import { body } from "express-validator";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSettingsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSiteSettings);
router.put(
  "/",
  requireAuth,
  [body("profilePhotoUrl").isString()],
  updateSiteSettings
);

export default router;
