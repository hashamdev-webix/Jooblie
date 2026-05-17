const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("../src/routes/auth");
const jobRoutes = require("../src/routes/jobs");
const applicationRoutes = require("../src/routes/applications");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Jooblie API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status_code: 404,
    message: "Endpoint not found",
    error: "Not Found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status_code: 500,
    message: "Internal server error",
    error: err.message,
  });
});

// Export for Vercel serverless
module.exports = app;
