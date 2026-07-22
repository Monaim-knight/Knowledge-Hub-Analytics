import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "node:path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import caseStudyRoutes from "./routes/caseStudyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import contentDraftRoutes from "./routes/contentDraftRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// Behind nginx reverse proxy (rate-limit uses X-Forwarded-For)
app.set("trust proxy", 1);

const configuredOrigins = process.env.CORS_ORIGIN?.split(",").map((v) => v.trim()) || [];

app.use(helmet());
app.use(
  cors({
    origin: process.env.NODE_ENV !== "production" ? true : configuredOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/case-studies", caseStudyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/content-drafts", contentDraftRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/upload", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start backend:", err.message);
    process.exit(1);
  }
}

startServer();

