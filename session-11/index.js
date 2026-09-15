/**
 * Main Application Entry Point
 * Express Server for Session 11 Doctor Module
 */

const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db");
const doctorRoutes = require("./routes/doctor.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount Doctor REST Routes
app.use("/doctors", doctorRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "MediCare Doctor Management API is running",
    modules: [
      "Session 11 - Doctor Entity Module (CRUD)",
      "Session 12 - Multer File Upload Integration"
    ]
  });
});

// Multer and general error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message || "An error occurred during request processing."
    });
  }
  next();
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}. Route not found.`
  });
});

let serverInstance = null;

// Start server if run directly
if (require.main === module) {
  connectDB()
    .then(() => {
      serverInstance = app.listen(PORT, () => {
        console.log(`Doctor Management API server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error(`Failed to start server: ${err.message}`);
      process.exit(1);
    });
}

module.exports = {
  app,
  serverInstance
};
