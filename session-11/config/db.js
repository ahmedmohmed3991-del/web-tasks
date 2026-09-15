/**
 * Database Configuration & Connection
 * Connects to MongoDB using Mongoose with environment variable support
 */

const mongoose = require("mongoose");

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/medicare_db";

/**
 * Establishes connection to MongoDB
 * @param {string} [uri] - Optional MongoDB connection URI override
 * @returns {Promise<typeof mongoose>}
 */
async function connectDB(uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI) {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    throw error;
  }
}

/**
 * Closes the active MongoDB connection
 */
async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log("[MongoDB Disconnected]");
  } catch (error) {
    console.error(`[MongoDB Disconnect Error] ${error.message}`);
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  DEFAULT_MONGO_URI
};
