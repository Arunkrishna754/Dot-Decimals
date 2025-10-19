import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// 🧩 Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔧 Starting server...");
console.log("📍 PORT:", PORT);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);

// ✅ CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://dot-decimals.vercel.app",
      "https://*.vercel.app",
      "https://*.onrender.com",
      "https://dot-decimals-1.onrender.com",
      "https://dot-decimals-admin.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health routes
app.get("/", (req, res) => {
  res.json({
    message: "API is running successfully!",
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "API endpoint is working!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/profile/addresses", profileRoutes);

// ✅ Serve frontend (IMPORTANT PART)
const adminBuildPath = path.join(__dirname, "../admin-frontend/dist");
app.use(express.static(adminBuildPath));

// ✅ Express v5 compatible catch-all route (fixes 404 on refresh)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/uploads")) {
    return next();
  }
  res.sendFile(path.join(adminBuildPath, "index.html"));
});

// ❌ Old 404 handler removed here because it was overriding frontend route

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// ✅ Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 URL: http://0.0.0.0:${PORT}`);

  connectDB()
    .then(() => console.log("✅ Database connected"))
    .catch((err) => console.error("❌ DB connection failed:", err));
});

// ✅ Handle server errors
server.on("error", (error) => {
  console.error("❌ Server error:", error);
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} already in use`);
  }
});

// ✅ Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
  });
});

export default app;
