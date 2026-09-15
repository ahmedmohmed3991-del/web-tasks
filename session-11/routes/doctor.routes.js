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
  deleteDoctor
} = require("../controllers/doctor.controller");

// Route mappings
router.post("/", createDoctor);
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.patch("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

module.exports = router;
