import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== "production",
  });
  console.log("MongoDB connected");
}

