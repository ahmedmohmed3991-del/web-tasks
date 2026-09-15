/**
 * Integration Test Suite for Session 11 & Session 12 Doctor Module
 *
 * Tests EVERY required route against live Express server and MongoDB:
 *
 * Session 11 CRUD Operations:
 * - POST   /doctors (JSON body)
 * - GET    /doctors (Get all)
 * - GET    /doctors/:id (Get by ID)
 * - PATCH  /doctors/:id (Update)
 * - DELETE /doctors/:id (Delete)
 * - Error Handling & Validation
 *
 * Session 12 Multer File Upload Features:
 * - POST   /doctors with multipart/form-data (Create with profile photo)
 * - GET    /uploads/doctors/:filename (Serve uploaded image statically)
 * - POST   /doctors/:id/upload with multipart/form-data (Dedicated image upload)
 * - PATCH  /doctors/:id with multipart/form-data (Update fields + replace photo)
 * - Validation: Reject non-image file formats (e.g. .txt)
 * - Validation: Handle missing file on dedicated upload route
 * - Verification of physical file existence on disk
 * - Verification of MongoDB storage of profileImage path
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { app } = require("../index");
const { connectDB, disconnectDB } = require("../config/db");
const Doctor = require("../models/doctor.model");

const TEST_PORT = 5055;
const TEST_MONGO_URI = "mongodb://127.0.0.1:27017/medicare_test_db";

// Standard 1x1 transparent PNG buffer for realistic image upload testing
const SAMPLE_PNG_BUFFER = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

// Standard 1x1 JPEG buffer
const SAMPLE_JPG_BUFFER = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  "base64"
);

function makeJsonRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const headers = {};
    let dataString = "";

    if (body) {
      dataString = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(dataString);
    }

    const req = http.request(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path,
        method,
        headers
      },
      (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk.toString();
        });
        res.on("end", () => {
          let parsed = null;
          try {
            parsed = JSON.parse(responseData);
          } catch {
            parsed = responseData;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed
          });
        });
      }
    );

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(dataString);
    }
    req.end();
  });
}

function makeMultipartRequest(method, path, fields = {}, files = {}) {
  return new Promise((resolve, reject) => {
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    const crlf = "\r\n";
    const chunks = [];

    // Append text fields
    for (const [key, value] of Object.entries(fields)) {
      chunks.push(
        Buffer.from(
          `--${boundary}${crlf}Content-Disposition: form-data; name="${key}"${crlf}${crlf}${value}${crlf}`
        )
      );
    }

    // Append files
    for (const [fieldName, fileInfo] of Object.entries(files)) {
      const filename = fileInfo.filename || "test.jpg";
      const contentType = fileInfo.contentType || "image/jpeg";
      const content = Buffer.isBuffer(fileInfo.content)
        ? fileInfo.content
        : Buffer.from(fileInfo.content || "");

      chunks.push(
        Buffer.from(
          `--${boundary}${crlf}Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"${crlf}Content-Type: ${contentType}${crlf}${crlf}`
        )
      );
      chunks.push(content);
      chunks.push(Buffer.from(crlf));
    }

    // Closing boundary
    chunks.push(Buffer.from(`--${boundary}--${crlf}`));

    const fullBody = Buffer.concat(chunks);

    const req = http.request(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path,
        method,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": fullBody.length
        }
      },
      (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk.toString();
        });
        res.on("end", () => {
          let parsed = null;
          try {
            parsed = JSON.parse(responseData);
          } catch {
            parsed = responseData;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed
          });
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(fullBody);
    req.end();
  });
}

function fetchStaticFile(filePath) {
  return new Promise((resolve, reject) => {
    http
      .get({ hostname: "localhost", port: TEST_PORT, path: filePath }, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: Buffer.concat(chunks)
          });
        });
      })
      .on("error", reject);
  });
}

async function runDoctorIntegrationTests() {
  console.log("===============================================================");
  console.log("   SESSION 11 & 12: DOCTOR MODULE & MULTER INTEGRATION TESTS   ");
  console.log("===============================================================\n");

  // Connect to test MongoDB database
  await connectDB(TEST_MONGO_URI);

  // Clean test collection
  await Doctor.deleteMany({ email: /test.*@medicare\.com/ });

  // Start Express server
  const server = await new Promise((resolve) => {
    const s = app.listen(TEST_PORT, () => {
      console.log(`[Test Server] Running on http://localhost:${TEST_PORT}\n`);
      resolve(s);
    });
  });

  let passed = 0;
  let total = 0;

  function assert(name, condition, details = "") {
    total++;
    if (condition) passed++;
    console.log(`[TEST ${total}] ${name} -> ${condition ? "PASS [OK]" : "FAIL [X]"}`);
    if (details) console.log(`  Details: ${details}`);
  }

  let createdDoctorId = null;
  const createdTestFiles = [];

  try {
    // =============================================================
    // PART 1: SESSION 11 CORE CRUD OPERATIONS
    // =============================================================

    // ROUTE 1: POST /doctors (Create new Doctor via JSON)
    console.log("--- 1. Testing POST /doctors (JSON body) ---");
    const newDoctorPayload = {
      name: "Dr. Gregory House",
      email: "test.house@medicare.com",
      specialization: "Diagnostic Medicine",
      department: "Internal Medicine",
      licenseNumber: "MED-HOUSE-9001",
      consultationFee: 250,
      available: true
    };

    const postRes = await makeJsonRequest("POST", "/doctors", newDoctorPayload);
    createdDoctorId = postRes.body?.data?._id;

    assert(
      "POST /doctors creates doctor and returns HTTP 201 Created",
      postRes.statusCode === 201 &&
      postRes.body.success === true &&
      postRes.body.data.name === "Dr. Gregory House" &&
      createdDoctorId !== undefined,
      `Status: ${postRes.statusCode}, Assigned ID: ${createdDoctorId}`
    );

    // Verify in MongoDB database
    const dbDocAfterPost = await Doctor.findById(createdDoctorId);
    assert(
      "Database verification: Doctor record exists in MongoDB",
      dbDocAfterPost !== null && dbDocAfterPost.licenseNumber === "MED-HOUSE-9001",
      `MongoDB Name: "${dbDocAfterPost?.name}", License: "${dbDocAfterPost?.licenseNumber}"`
    );

    // ROUTE 2: GET /doctors (Get all Doctors)
    console.log("\n--- 2. Testing GET /doctors ---");
    const getAllRes = await makeJsonRequest("GET", "/doctors");
    assert(
      "GET /doctors returns HTTP 200 and array of doctors",
      getAllRes.statusCode === 200 &&
      getAllRes.body.success === true &&
      Array.isArray(getAllRes.body.data) &&
      getAllRes.body.data.length >= 1,
      `Status: ${getAllRes.statusCode}, Count: ${getAllRes.body.count}`
    );

    // ROUTE 3: GET /doctors/:id (Get by ID)
    console.log(`\n--- 3. Testing GET /doctors/${createdDoctorId} ---`);
    const getByIdRes = await makeJsonRequest("GET", `/doctors/${createdDoctorId}`);
    assert(
      "GET /doctors/:id returns HTTP 200 and requested doctor",
      getByIdRes.statusCode === 200 &&
      getByIdRes.body.success === true &&
      getByIdRes.body.data._id === createdDoctorId,
      `Status: ${getByIdRes.statusCode}, Doctor: ${getByIdRes.body.data.name} (${getByIdRes.body.data.specialization})`
    );

    // ROUTE 4: PATCH /doctors/:id (Update Doctor via JSON)
    console.log(`\n--- 4. Testing PATCH /doctors/${createdDoctorId} ---`);
    const updatePayload = {
      consultationFee: 320,
      available: false
    };
    const patchRes = await makeJsonRequest("PATCH", `/doctors/${createdDoctorId}`, updatePayload);
    assert(
      "PATCH /doctors/:id returns HTTP 200 and updated doctor fields",
      patchRes.statusCode === 200 &&
      patchRes.body.success === true &&
      patchRes.body.data.consultationFee === 320 &&
      patchRes.body.data.available === false,
      `Status: ${patchRes.statusCode}, New Fee: $${patchRes.body.data.consultationFee}, Available: ${patchRes.body.data.available}`
    );

    // Verify update in MongoDB
    const dbDocAfterPatch = await Doctor.findById(createdDoctorId);
    assert(
      "Database verification: MongoDB reflects updated consultation fee ($320)",
      dbDocAfterPatch.consultationFee === 320 && dbDocAfterPatch.available === false
    );

    // ROUTE 5: DELETE /doctors/:id (Delete Doctor)
    console.log(`\n--- 5. Testing DELETE /doctors/${createdDoctorId} ---`);
    const deleteRes = await makeJsonRequest("DELETE", `/doctors/${createdDoctorId}`);
    assert(
      "DELETE /doctors/:id returns HTTP 200 and confirms deletion",
      deleteRes.statusCode === 200 &&
      deleteRes.body.success === true &&
      deleteRes.body.message.includes("deleted successfully"),
      `Status: ${deleteRes.statusCode}, Message: "${deleteRes.body.message}"`
    );

    // Verify deletion in MongoDB
    const dbDocAfterDelete = await Doctor.findById(createdDoctorId);
    assert(
      "Database verification: Document no longer exists in MongoDB",
      dbDocAfterDelete === null
    );

    // Error Cases
    console.log("\n--- 6. Testing Core Error Cases ---");
    const notFoundRes = await makeJsonRequest("GET", `/doctors/${createdDoctorId}`);
    assert(
      "GET non-existent ID returns HTTP 404 Not Found",
      notFoundRes.statusCode === 404 && notFoundRes.body.success === false
    );

    const malformedIdRes = await makeJsonRequest("GET", "/doctors/not-a-mongo-id");
    assert(
      "GET with malformed ObjectId returns HTTP 400 Bad Request",
      malformedIdRes.statusCode === 400 && malformedIdRes.body.error.includes("Invalid ID format")
    );

    const invalidPostRes = await makeJsonRequest("POST", "/doctors", { name: "Incomplete Doctor" });
    assert(
      "POST with missing required fields returns HTTP 400 Validation Error",
      invalidPostRes.statusCode === 400 && invalidPostRes.body.error.includes("Validation Error")
    );

    // =============================================================
    // PART 2: SESSION 12 MULTER FILE UPLOAD INTEGRATION
    // =============================================================
    console.log("\n=============================================================");
    console.log("   PART 2: MULTER FILE UPLOAD TESTS                          ");
    console.log("=============================================================\n");

    // 7. POST /doctors with multipart/form-data & image upload
    console.log("--- 7. Testing POST /doctors with file upload (multipart/form-data) ---");
    const doctorWithPhotoFields = {
      name: "Dr. Lisa Cuddy",
      email: "test.cuddy@medicare.com",
      specialization: "Endocrinology",
      department: "Administration & Clinical Care",
      licenseNumber: "MED-CUDDY-8002",
      consultationFee: "350",
      available: "true"
    };
    const doctorWithPhotoFiles = {
      profileImage: {
        filename: "dr_cuddy_headshot.png",
        contentType: "image/png",
        content: SAMPLE_PNG_BUFFER
      }
    };

    const multipartPostRes = await makeMultipartRequest(
      "POST",
      "/doctors",
      doctorWithPhotoFields,
      doctorWithPhotoFiles
    );

    const cuddyDoctorId = multipartPostRes.body?.data?._id;
    const cuddyImagePath = multipartPostRes.body?.data?.profileImage;

    assert(
      "POST /doctors with multipart/form-data creates doctor with profileImage",
      multipartPostRes.statusCode === 201 &&
      multipartPostRes.body.success === true &&
      cuddyImagePath !== null &&
      cuddyImagePath.startsWith("/uploads/doctors/"),
      `Status: ${multipartPostRes.statusCode}, Assigned Image: ${cuddyImagePath}`
    );

    // Track file for cleanup
    if (cuddyImagePath) {
      const physicalDiskPath = path.join(__dirname, "..", cuddyImagePath);
      createdTestFiles.push(physicalDiskPath);

      // Verify physical existence on disk
      assert(
        "Filesystem verification: Uploaded image file physically exists on disk",
        fs.existsSync(physicalDiskPath),
        `Disk Path: ${physicalDiskPath}`
      );
    }

    // Verify MongoDB storage of profileImage
    const cuddyDbDoc = await Doctor.findById(cuddyDoctorId);
    assert(
      "Database verification: MongoDB document stores uploaded profileImage path",
      cuddyDbDoc !== null && cuddyDbDoc.profileImage === cuddyImagePath,
      `MongoDB profileImage: "${cuddyDbDoc?.profileImage}"`
    );

    // 8. Verify static asset serving for uploaded image
    console.log("\n--- 8. Testing Static Image Serving (GET /uploads/...) ---");
    const staticRes = await fetchStaticFile(cuddyImagePath);
    assert(
      "Static route serves uploaded doctor profile image with HTTP 200",
      staticRes.statusCode === 200 && staticRes.data.length === SAMPLE_PNG_BUFFER.length,
      `HTTP Status: ${staticRes.statusCode}, Received Bytes: ${staticRes.data.length}`
    );

    // 9. Dedicated upload endpoint: POST /doctors/:id/upload
    console.log(`\n--- 9. Testing dedicated upload endpoint: POST /doctors/${cuddyDoctorId}/upload ---`);
    const dedicatedUploadFiles = {
      profileImage: {
        filename: "dr_cuddy_new_avatar.jpg",
        contentType: "image/jpeg",
        content: SAMPLE_JPG_BUFFER
      }
    };

    const dedicatedUploadRes = await makeMultipartRequest(
      "POST",
      `/doctors/${cuddyDoctorId}/upload`,
      {},
      dedicatedUploadFiles
    );

    const newUploadedPath = dedicatedUploadRes.body?.data?.profileImage;
    if (newUploadedPath) {
      createdTestFiles.push(path.join(__dirname, "..", newUploadedPath));
    }

    assert(
      "POST /doctors/:id/upload updates doctor's profileImage and returns file metadata",
      dedicatedUploadRes.statusCode === 200 &&
      dedicatedUploadRes.body.success === true &&
      dedicatedUploadRes.body.file?.mimetype === "image/jpeg" &&
      newUploadedPath !== cuddyImagePath,
      `Status: ${dedicatedUploadRes.statusCode}, New Image: ${newUploadedPath}`
    );

    // Verify database reflection of new avatar
    const cuddyAfterDedicatedUpload = await Doctor.findById(cuddyDoctorId);
    assert(
      "Database verification: Doctor profileImage successfully updated in MongoDB",
      cuddyAfterDedicatedUpload.profileImage === newUploadedPath
    );

    // 10. PATCH /doctors/:id with multipart/form-data (Updating text field + new image)
    console.log(`\n--- 10. Testing PATCH /doctors/${cuddyDoctorId} with multipart/form-data ---`);
    const patchMultipartRes = await makeMultipartRequest(
      "PATCH",
      `/doctors/${cuddyDoctorId}`,
      { consultationFee: "420" },
      {
        profileImage: {
          filename: "dr_cuddy_final_badge.png",
          contentType: "image/png",
          content: SAMPLE_PNG_BUFFER
        }
      }
    );

    const patchedPath = patchMultipartRes.body?.data?.profileImage;
    if (patchedPath) {
      createdTestFiles.push(path.join(__dirname, "..", patchedPath));
    }

    assert(
      "PATCH /doctors/:id updates both text fields and profile photo simultaneously",
      patchMultipartRes.statusCode === 200 &&
      patchMultipartRes.body.data.consultationFee === 420 &&
      patchedPath !== newUploadedPath,
      `New Fee: $${patchMultipartRes.body.data.consultationFee}, New Photo: ${patchedPath}`
    );

    // 11. Validation: Reject non-image file formats (e.g. text/plain or .txt)
    console.log("\n--- 11. Testing Upload Validation (Reject non-image files) ---");
    const invalidUploadRes = await makeMultipartRequest(
      "POST",
      `/doctors/${cuddyDoctorId}/upload`,
      {},
      {
        profileImage: {
          filename: "malicious_script.txt",
          contentType: "text/plain",
          content: "plain text file content"
        }
      }
    );

    assert(
      "Uploading non-image file is rejected with HTTP 400 Bad Request",
      invalidUploadRes.statusCode === 400 &&
      invalidUploadRes.body.success === false &&
      invalidUploadRes.body.error.includes("Only image files"),
      `Status: ${invalidUploadRes.statusCode}, Error: "${invalidUploadRes.body.error}"`
    );

    // 12. Validation: Handle missing file on dedicated upload route
    console.log("\n--- 12. Testing Missing File on Upload Route ---");
    const missingFileRes = await makeMultipartRequest(
      "POST",
      `/doctors/${cuddyDoctorId}/upload`,
      {},
      {}
    );

    assert(
      "Calling upload endpoint without a file returns HTTP 400 Bad Request",
      missingFileRes.statusCode === 400 &&
      missingFileRes.body.success === false &&
      missingFileRes.body.error.includes("No image file provided"),
      `Status: ${missingFileRes.statusCode}, Error: "${missingFileRes.body.error}"`
    );

    console.log("\n===============================================================");
    console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log("===============================================================\n");
  } finally {
    // Cleanup test database records
    await Doctor.deleteMany({ email: /test.*@medicare\.com/ });
    await disconnectDB();

    // Cleanup generated test image files
    for (const filePath of createdTestFiles) {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore cleanup errors
        }
      }
    }

    // Close test server
    await new Promise((res) => server.close(res));
  }
}

if (require.main === module) {
  runDoctorIntegrationTests();
}

module.exports = runDoctorIntegrationTests;
