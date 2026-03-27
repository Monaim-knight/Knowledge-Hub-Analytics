import { validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import Contact from "../models/Contact.js";
import { sendContactNotification } from "../config/email.js";

function clean(value = "") {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

export async function createContact(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const payload = {
      name: clean(req.body.name),
      email: clean(req.body.email).toLowerCase(),
      message: clean(req.body.message),
    };

    const contact = await Contact.create(payload);

    try {
      await sendContactNotification(contact);
    } catch (emailError) {
      console.error("Email notification failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      data: { id: contact._id },
    });
  } catch (err) {
    next(err);
  }
}

export async function getContacts(_req, res, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
}

