import express from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { createContact, getContacts } from "../controllers/contactController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

router.post(
  "/",
  contactRateLimiter,
  [
    body("name").isString().isLength({ min: 2, max: 120 }),
    body("email").isEmail(),
    body("message").isString().isLength({ min: 10, max: 5000 }),
  ],
  createContact
);

router.get("/", requireAuth, getContacts);

export default router;

