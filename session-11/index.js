/**
 * Main Application Entry Point
 * Express Server for Session 11 Doctor Module
 */

const express = require("express");
const { connectDB } = require("./config/db");
const doctorRoutes = require("./routes/doctor.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON request bodies
app.use(express.json());

// Mount Doctor REST Routes
app.use("/doctors", doctorRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "MediCare Doctor Management API is running",
    module: "Session 11 - Doctor Entity Module"
  });
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
