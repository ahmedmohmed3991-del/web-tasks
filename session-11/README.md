# MediCare Doctor Entity Module — Backend REST API & Multer File Upload

Implementation of **Session 11 (Create Your First Module)** and **Session 12 (Enhance Your Module with Real Backend Features — Multer File Upload)** based directly on the final graduation project plan (**MediCare — Cloud Hospital Management & Clinical Care Platform**).

This backend module is built with **Node.js**, **Express**, **MongoDB**, **Mongoose**, and **Multer**, providing a production-grade REST API for managing the **Doctor** entity, complete with profile photo uploads, static asset serving, schema validation, and persistence in MongoDB.

---

## 📁 Project Structure

```
session-11/
├── config/
│   └── db.js                      # MongoDB connection using Mongoose
├── controllers/
│   └── doctor.controller.js       # Business logic for Doctor CRUD & photo upload
├── middleware/
│   └── upload.js                  # Multer diskStorage, image filter & size limits
├── models/
│   └── doctor.model.js            # Mongoose Doctor schema (7 fields + profileImage)
├── routes/
│   └── doctor.routes.js           # Express REST endpoints & upload routing
├── test/
│   └── doctor.test.js             # 20-point automated integration test suite
├── uploads/
│   └── doctors/                   # Upload destination for doctor profile images
│       └── .gitkeep               # Directory placeholder for git tracking
├── index.js                       # Express server entry point & static file serving
├── package.json                   # Project dependencies and npm scripts
├── .gitignore                     # Git rules (ignores node_modules, .env, uploads)
└── README.md                      # Comprehensive documentation
```

---

## 🏥 1. Entity Chosen & Project Context

### Selected Entity: `Doctor`
In strict alignment with Session 10 and Session 11 requirements:
- **Entity**: `Doctor` (`doctor_profiles`)
- **System Context**: MediCare Cloud Hospital Management System. Doctors represent primary clinical providers who conduct patient consultations, diagnose medical conditions, and author clinical notes.
- **Session 12 Enhancement**: Real-world medical portals require practitioner identification and credentialing verification. Multer allows administrative users or medical staff to upload authentic profile photographs (headshots/badges) that are stored on disk and linked directly to the practitioner's MongoDB record.

---

## 📋 2. Mongoose Model Fields

The `Doctor` model (`models/doctor.model.js`) contains 8 fields with validation constraints and automated timestamps:

| Field Name | Type | Constraints | Description |
| :--- | :---: | :---: | :--- |
| `name` | `String` | Required, Trim, Min 2 chars | Full name of the medical practitioner |
| `email` | `String` | Required, Unique, Lowercase, Regex match | Professional contact email address |
| `specialization` | `String` | Required, Trim | Area of medical expertise (e.g. Cardiology, Neurology) |
| `department` | `String` | Required, Trim | Hospital department (e.g. Internal Medicine) |
| `licenseNumber` | `String` | Required, Unique, Uppercase, Trim | State/Board Medical Practice License ID |
| `consultationFee` | `Number` | Required, Min 0 | Standard consultation visit fee in USD |
| `available` | `Boolean` | Default: `true` | Real-time on-duty consultation availability |
| `profileImage` | `String` | Default: `null` | Relative web/storage URL to uploaded profile photo |
| `createdAt` | `Date` | Automatic timestamp | Record creation timestamp |
| `updatedAt` | `Date` | Automatic timestamp | Record last modification timestamp |

---

## 🚀 3. Features Implemented

### Core CRUD Features (Session 11)
- **POST `/doctors`**: Creates a new doctor record with complete validation and duplicate check.
- **GET `/doctors`**: Retrieves all doctors sorted chronologically.
- **GET `/doctors/:id`**: Retrieves a single doctor by MongoDB ObjectId with 400/404 validation.
- **PATCH `/doctors/:id`**: Updates specific fields with schema validator checks.
- **DELETE `/doctors/:id`**: Deletes a doctor document from MongoDB.

### File Upload Features (Session 12)
- **Multer Disk Storage**: Saves uploaded images to `uploads/doctors/` with collision-safe unique filenames combining timestamps and sanitized original names.
- **MIME & Extension Security Validation**: Accepts only legitimate image formats (`JPEG`, `JPG`, `PNG`, `WEBP`, `GIF`); automatically rejects executables or arbitrary file types with a descriptive HTTP 400 response.
- **File Size Protection**: Limits individual image uploads to a maximum of 5 MB.
- **Multiple Upload Modalities**:
  1. Upload image during creation (`POST /doctors` with `multipart/form-data`).
  2. Dedicated image upload endpoint (`POST /doctors/:id/upload` with `multipart/form-data`).
  3. Upload image during partial update (`PATCH /doctors/:id` with `multipart/form-data`).
- **Static File Serving**: Serves the `uploads/` directory directly via `GET /uploads/doctors/:filename`, making photos immediately viewable in browsers and client apps.
- **Database Association**: Saves the public access path `/uploads/doctors/:filename` directly into MongoDB under `profileImage`.

---

## 🌐 4. REST Routes Summary

| Method | Endpoint | Content-Type | Description | Success Status |
| :--- | :--- | :--- | :--- | :---: |
| **POST** | `/doctors` | `application/json` or `multipart/form-data` | Create new doctor (with optional photo) | `201 Created` |
| **GET** | `/doctors` | None | Retrieve all doctors | `200 OK` |
| **GET** | `/doctors/:id` | None | Retrieve single doctor by ID | `200 OK` |
| **PATCH** | `/doctors/:id` | `application/json` or `multipart/form-data` | Update doctor fields / photo | `200 OK` |
| **DELETE** | `/doctors/:id` | None | Delete doctor by ID | `200 OK` |
| **POST** | `/doctors/:id/upload` | `multipart/form-data` | Dedicated photo upload endpoint | `200 OK` |
| **GET** | `/uploads/doctors/:file` | None | Serve uploaded image statically | `200 OK` |

---

## 🛠️ 5. How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Active MongoDB database service running locally on port 27017, or a remote MongoDB Atlas connection URI.

### Steps
```bash
# 1. Open your terminal and navigate to the module directory
cd session-11

# 2. Install dependencies (express, mongoose, multer)
npm install

# 3. Start the application
npm start
```
The application will connect to MongoDB and output:
```text
[MongoDB Connected] Host: 127.0.0.1, Database: medicare_db
Doctor Management API server running on http://localhost:5000
```

### Environment Configuration
The database connection defaults to `mongodb://127.0.0.1:27017/medicare_db`. You can customize the URI or port using environment variables:
```bash
# Windows PowerShell
$env:PORT="5000"
$env:MONGODB_URI="mongodb://127.0.0.1:27017/medicare_db"
npm start

# Linux / macOS
PORT=5000 MONGODB_URI="mongodb://127.0.0.1:27017/medicare_db" npm start
```

---

## 📖 6. Examples of API Usage Described in Text

Per project instructions, the usage patterns below are described textually to guide manual testing in Postman or frontend integration:

### 1. Creating a Doctor with an Uploaded Profile Image
- **Endpoint and Method**: Send an HTTP `POST` request to `http://localhost:5000/doctors`.
- **Request Configuration**: Select `multipart/form-data` in your HTTP client.
- **Form Fields**:
  - `name`: Enter the practitioner's full name (for example, *Dr. Lisa Cuddy*).
  - `email`: Enter a valid, unique email address (such as *cuddy@medicare.com*).
  - `specialization`: Enter the medical field (such as *Endocrinology*).
  - `department`: Enter the clinical unit (such as *Administration & Clinical Care*).
  - `licenseNumber`: Enter the board license code (such as *MED-CUDDY-8002*).
  - `consultationFee`: Enter the numerical visit fee (such as *350*).
  - `available`: Set to *true* or *false*.
  - `profileImage`: Set field type to **File**, and choose an image from your computer (such as a PNG or JPEG headshot).
- **Outcome**: The server processes the multipart boundary, verifies the file is an image, writes the file to `uploads/doctors/`, stores the relative path in the doctor's document, and responds with HTTP status `201 Created` returning the newly created doctor object containing the assigned MongoDB identifier and the `/uploads/doctors/...` URL.

### 2. Uploading or Replacing a Photo for an Existing Doctor
- **Endpoint and Method**: Send an HTTP `POST` request to `http://localhost:5000/doctors/:id/upload`, substituting `:id` with the hex ObjectId of an existing doctor.
- **Request Configuration**: Set the request body type to `form-data`.
- **Form Fields**:
  - `profileImage`: Set the key type to **File**, and select a JPEG or PNG picture.
- **Outcome**: The server checks that the doctor ID is a valid MongoDB ObjectId, confirms the doctor exists in the database, saves the file in the upload directory, updates the doctor's `profileImage` field to point to the newly uploaded image, and responds with HTTP status `200 OK`. The response includes a success message, the updated doctor object, and a file metadata descriptor indicating original filename, stored filename, size in bytes, and mime type.

### 3. Fetching the Uploaded Image in a Web Browser
- **Endpoint and Method**: Send an HTTP `GET` request to `http://localhost:5000/uploads/doctors/<generated-filename>.jpg` (using the path returned in `profileImage`).
- **Outcome**: Express static middleware resolves the file on the filesystem and streams the image binary with the appropriate `Content-Type` header (such as `image/jpeg` or `image/png`), rendering the photo directly in the browser.

### 4. Updating Doctor Information and Photo Concurrently
- **Endpoint and Method**: Send an HTTP `PATCH` request to `http://localhost:5000/doctors/:id`.
- **Request Configuration**: Use `multipart/form-data` containing only the fields you wish to modify (such as `consultationFee` set to *400* and a replacement image under `profileImage`).
- **Outcome**: The server updates only the provided fields while keeping all other doctor information intact, saving the new photo and responding with HTTP status `200 OK`.

### 5. Standard JSON CRUD Operations
- For standard creation without photo upload, send an HTTP `POST` to `/doctors` with `Content-Type: application/json` containing the required doctor attributes.
- To retrieve all doctors, send an HTTP `GET` to `/doctors`.
- To retrieve a specific doctor, send an HTTP `GET` to `/doctors/:id`.
- To delete a doctor, send an HTTP `DELETE` to `/doctors/:id`. The server removes the document from MongoDB and responds with HTTP status `200 OK`.

---

## 🧪 7. How to Test the Upload and API

### Automated Testing Suite
A comprehensive 20-assertion integration test suite is included in `test/doctor.test.js` that spins up the Express server and executes native HTTP requests against the local MongoDB instance:

```bash
npm test
```

#### What the Test Suite Verifies
1. **POST /doctors (JSON)**: Verifies standard doctor document creation and HTTP 201.
2. **MongoDB Persistence**: Queries MongoDB directly to confirm document storage.
3. **GET /doctors**: Verifies list retrieval and total count.
4. **GET /doctors/:id**: Verifies single doctor retrieval by ObjectId.
5. **PATCH /doctors/:id (JSON)**: Updates consultation fee and availability; verifies changes in MongoDB.
6. **DELETE /doctors/:id**: Deletes doctor; confirms complete removal from MongoDB.
7. **Error Handling**: Tests 404 for missing IDs, 400 for malformed IDs, and 400 for missing required fields.
8. **POST /doctors with Multer Upload**: Sends multipart form with a real PNG image buffer; verifies HTTP 201, file creation in `uploads/doctors/`, and database `profileImage` storage.
9. **Physical File Verification**: Asserts that the uploaded image physically exists on disk.
10. **Static Serving**: Fetches the uploaded image via `GET /uploads/doctors/...`; verifies HTTP 200 and byte integrity.
11. **Dedicated Upload Route**: Tests `POST /doctors/:id/upload` with a JPEG buffer; asserts database reflection.
12. **PATCH with Image Upload**: Tests simultaneous text field update and photo replacement via multipart request.
13. **File Type Filter**: Uploads a text file (`.txt`); verifies rejection with HTTP 400 and error message.
14. **Missing File Handling**: Calls upload route without a file; verifies rejection with HTTP 400.

### Testing in Postman
To perform manual testing in Postman:
1. Ensure the server is running (`npm start`).
2. Create a new request with method `POST` and URL `http://localhost:5000/doctors`.
3. Under the **Body** tab, select **form-data**.
4. Add key `name` with value `Dr. Gregory House`.
5. Add key `email` with value `house@medicare.com`.
6. Add key `specialization` with value `Diagnostic Medicine`.
7. Add key `department` with value `Internal Medicine`.
8. Add key `licenseNumber` with value `MED-HOUSE-9001`.
9. Add key `consultationFee` with value `250`.
10. Add key `available` with value `true`.
11. Hover over the next key input, click the dropdown to switch from **Text** to **File**, type `profileImage`, and select an image from your computer.
12. Click **Send**. Verify the response status is `201 Created` and `profileImage` contains the image URL path.
13. Copy the returned `_id` and test `GET http://localhost:5000/doctors/:id`.
14. Test uploading a replacement image using `POST http://localhost:5000/doctors/:id/upload` with form-data key `profileImage`.
