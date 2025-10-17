import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Create default admin if not exists
const createAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌ ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD not set in .env");
    return;
  }

  try {
    // Check if admin with this email already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL, role: "admin" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", ADMIN_EMAIL);
      return; // Admin exists, do nothing
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create new admin
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Default admin created:", admin.email);
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
  }
};

// Connect to DB and create admin
connectDB().then(createAdmin);
