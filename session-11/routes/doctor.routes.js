/**
 * Routes: Doctor Router
 * Maps REST endpoints to Doctor controller methods
 */

const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  uploadDoctorImage
} = require("../controllers/doctor.controller");
const { handleImageUpload } = require("../middleware/upload");

// Route mappings
router.post("/", handleImageUpload, createDoctor);
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.patch("/:id", handleImageUpload, updateDoctor);
router.delete("/:id", deleteDoctor);

// Dedicated image upload route
router.post("/:id/upload", handleImageUpload, uploadDoctorImage);

module.exports = router;
