 const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Middleware
const protect = require("./middleware/authMiddleware");
const adminOnly = require("./middleware/adminMiddleware");

// Connect MongoDB
connectDB();

const app = express();

// =============================
// Global Middleware
// =============================

app.use(cors());
app.use(express.json());

// =============================
// Test REST API
// =============================

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SHOPORA REST API is working!",
  });
});

// =============================
// Product REST API
// =============================

app.use("/api/products", productRoutes);

// =============================
// Authentication REST API
// =============================

app.use("/api/auth", authRoutes);

// =============================
// Protected Profile API
// =============================

app.get("/api/auth/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected API accessed successfully!",
    userId: req.user.userId,
    role: req.user.role,
  });
});

// =============================
// Orders REST API
// =============================

app.use("/api/orders", orderRoutes);

// =============================
// Admin Test API
// =============================

app.get("/api/admin/test", adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin API accessed successfully!",
    adminId: req.user.userId,
    role: req.user.role,
  });
});

// =============================
// Root Route
// =============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SHOPORA REST API",
  });
});

// =============================
// Server
// =============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});