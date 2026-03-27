import express from "express";
import { body } from "express-validator";
import { login, logout } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isString().isLength({ min: 6 }).withMessage("Password is required"),
  ],
  login
);

router.post("/logout", logout);

export default router;

