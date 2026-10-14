 const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JOB PORTAL REST API is working!",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.get("/api/auth/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected API accessed successfully!",
    userId: req.user.userId,
    role: req.user.role,
  });
});
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Root API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Job Portal REST API",
  });
});

// Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});