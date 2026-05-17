const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes from backend
const authRoutes = require("../backend/src/routes/auth");
const jobRoutes = require("../backend/src/routes/jobs");
const applicationRoutes = require("../backend/src/routes/applications");

// Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Jooblie API is running on Vercel",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root API endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Jooblie API",
    version: "1.0.0",
    endpoints: {
      health: "/api/v1/health",
      auth: "/api/v1/auth",
      jobs: "/api/v1/jobs",
      applications: "/api/v1/applications",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status_code: 404,
    message: "Endpoint not found",
    error: "Not Found",
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status_code: 500,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// Export for Vercel serverless
module.exports = app;
