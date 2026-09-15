/**
 * Middleware: Multer File Upload Configuration
 * Handles image uploads for Doctor profiles
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Target directory for uploaded doctor images
const uploadDirectory = path.join(__dirname, "../uploads/doctors");

// Ensure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `doctor-${uniqueSuffix}${ext || ".jpg"}`);
  }
});

// Image MIME-type and extension validation filter
const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif"
  ];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    const err = new Error(
      "Invalid file type. Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed."
    );
    err.code = "INVALID_FILE_TYPE";
    cb(err, false);
  }
};

// Multer upload instance with 5MB size limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

// Middleware wrapper to handle image uploads cleanly and gracefully
const handleImageUpload = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  upload.any()(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          error: "File size limit exceeded. Maximum allowed size is 5MB."
        });
      }
      return res.status(400).json({
        success: false,
        error: err.message || "File upload error"
      });
    }

    if (req.files && req.files.length > 0) {
      req.file =
        req.files.find((f) =>
          ["profileImage", "image", "avatar", "photo", "file"].includes(f.fieldname)
        ) || req.files[0];
    }
    next();
  });
};

module.exports = {
  upload,
  handleImageUpload,
  uploadDirectory
};
