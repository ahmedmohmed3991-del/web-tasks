/**
 * Mongoose Model: Doctor
 * Entity from Session 10 MediCare Hospital Management System
 *
 * Fields:
 * - name: Doctor's full name (String, required)
 * - email: Professional email (String, required, unique)
 * - specialization: Area of medical expertise (String, required)
 * - department: Hospital clinical department (String, required)
 * - licenseNumber: State/Board Medical License ID (String, required, unique)
 * - consultationFee: Standard visit consultation fee in USD (Number, required, min 0)
 * - available: Current on-duty availability status (Boolean, default true)
 * - timestamps: Automatically tracks createdAt and updatedAt
 */

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
      minlength: [2, "Doctor name must be at least 2 characters long"]
    },
    email: {
      type: String,
      required: [true, "Doctor email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true
    },
    department: {
      type: String,
      required: [true, "Hospital department is required"],
      trim: true
    },
    licenseNumber: {
      type: String,
      required: [true, "Medical license number is required"],
      unique: true,
      trim: true,
      uppercase: true
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Consultation fee cannot be negative"]
    },
    available: {
      type: Boolean,
      default: true
    },
    profileImage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
