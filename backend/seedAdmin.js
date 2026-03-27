import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import AdminUser from "./models/AdminUser.js";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
  }

  await connectDB();

  const existing = await AdminUser.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    console.log(`Admin already exists: ${existing.email}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await AdminUser.create({
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  console.log(`Admin created: ${admin.email}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Admin seed failed:", err.message);
  process.exit(1);
});

