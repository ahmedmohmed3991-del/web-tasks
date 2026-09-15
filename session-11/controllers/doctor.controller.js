/**
 * Controller: Doctor Controller
 * Handles business logic for Doctor CRUD operations
 */

const mongoose = require("mongoose");
const Doctor = require("../models/doctor.model");

/**
 * POST /doctors
 * Create a new Doctor record
 */
async function createDoctor(req, res) {
  try {
    const { name, email, specialization, department, licenseNumber, consultationFee, available } = req.body;

    const doctor = new Doctor({
      name,
      email,
      specialization,
      department,
      licenseNumber,
      consultationFee,
      available: available !== undefined ? available : true
    });

    const savedDoctor = await doctor.save();
    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: savedDoctor
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        success: false,
        error: `Duplicate Error: A doctor with this ${duplicateField} already exists.`
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: `Validation Error: ${messages.join(", ")}`
      });
    }

    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    });
  }
}

/**
 * GET /doctors
 * Retrieve all Doctors
 */
async function getAllDoctors(req, res) {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    });
  }
}

/**
 * GET /doctors/:id
 * Retrieve a single Doctor by ID
 */
async function getDoctorById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ID format: '${id}' is not a valid MongoDB ObjectId.`
      });
    }

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: `Doctor with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    });
  }
}

/**
 * PATCH /doctors/:id
 * Update an existing Doctor record
 */
async function updateDoctor(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ID format: '${id}' is not a valid MongoDB ObjectId.`
      });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!doctorExist(updatedDoctor)) {
      return res.status(404).json({
        success: false,
        error: `Doctor with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        success: false,
        error: `Duplicate Error: A doctor with this ${duplicateField} already exists.`
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: `Validation Error: ${messages.join(", ")}`
      });
    }

    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    });
  }
}

/**
 * Helper to test if doctor was found
 */
function doctorExist(doc) {
  return doc !== null && doc !== undefined;
}

/**
 * DELETE /doctors/:id
 * Delete a Doctor record
 */
async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ID format: '${id}' is not a valid MongoDB ObjectId.`
      });
    }

    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(404).json({
        success: false,
        error: `Doctor with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data: deletedDoctor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    });
  }
}

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};
