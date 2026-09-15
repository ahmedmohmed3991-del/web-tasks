/**
 * Integration Test Suite for Session 11 Doctor Module
 *
 * Tests EVERY required route against live Express server and MongoDB:
 * - POST   /doctors
 * - GET    /doctors (Get all)
 * - GET    /doctors/:id (Get by ID)
 * - PATCH  /doctors/:id (Update)
 * - DELETE /doctors/:id (Delete)
 * - Error Handling & Validation
 */

const http = require("http");
const { app } = require("../index");
const { connectDB, disconnectDB } = require("../config/db");
const Doctor = require("../models/doctor.model");

const TEST_PORT = 5055;
const TEST_MONGO_URI = "mongodb://127.0.0.1:27017/medicare_test_db";

function makeRequest(method, path, body = null) {
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

async function runDoctorIntegrationTests() {
  console.log("=================================================");
  console.log("   SESSION 11: DOCTOR MODULE INTEGRATION TESTS   ");
  console.log("=================================================\n");

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

  try {
    // -------------------------------------------------------------
    // ROUTE 1: POST /doctors (Create new Doctor)
    // -------------------------------------------------------------
    console.log("--- 1. Testing POST /doctors ---");
    const newDoctorPayload = {
      name: "Dr. Gregory House",
      email: "test.house@medicare.com",
      specialization: "Diagnostic Medicine",
      department: "Internal Medicine",
      licenseNumber: "MED-HOUSE-9001",
      consultationFee: 250,
      available: true
    };

    const postRes = await makeRequest("POST", "/doctors", newDoctorPayload);
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
      "Database verification: Record exists in MongoDB",
      dbDocAfterPost !== null && dbDocAfterPost.licenseNumber === "MED-HOUSE-9001",
      `MongoDB Name: "${dbDocAfterPost?.name}", License: "${dbDocAfterPost?.licenseNumber}"`
    );

    // -------------------------------------------------------------
    // ROUTE 2: GET /doctors (Get all Doctors)
    // -------------------------------------------------------------
    console.log("\n--- 2. Testing GET /doctors ---");
    const getAllRes = await makeRequest("GET", "/doctors");
    assert(
      "GET /doctors returns HTTP 200 and array of doctors",
      getAllRes.statusCode === 200 &&
      getAllRes.body.success === true &&
      Array.isArray(getAllRes.body.data) &&
      getAllRes.body.data.length >= 1,
      `Status: ${getAllRes.statusCode}, Count: ${getAllRes.body.count}`
    );

    // -------------------------------------------------------------
    // ROUTE 3: GET /doctors/:id (Get by ID)
    // -------------------------------------------------------------
    console.log(`\n--- 3. Testing GET /doctors/${createdDoctorId} ---`);
    const getByIdRes = await makeRequest("GET", `/doctors/${createdDoctorId}`);
    assert(
      "GET /doctors/:id returns HTTP 200 and requested doctor",
      getByIdRes.statusCode === 200 &&
      getByIdRes.body.success === true &&
      getByIdRes.body.data._id === createdDoctorId,
      `Status: ${getByIdRes.statusCode}, Doctor: ${getByIdRes.body.data.name} (${getByIdRes.body.data.specialization})`
    );

    // -------------------------------------------------------------
    // ROUTE 4: PATCH /doctors/:id (Update Doctor)
    // -------------------------------------------------------------
    console.log(`\n--- 4. Testing PATCH /doctors/${createdDoctorId} ---`);
    const updatePayload = {
      consultationFee: 320,
      available: false
    };
    const patchRes = await makeRequest("PATCH", `/doctors/${createdDoctorId}`, updatePayload);
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

    // -------------------------------------------------------------
    // ROUTE 5: DELETE /doctors/:id (Delete Doctor)
    // -------------------------------------------------------------
    console.log(`\n--- 5. Testing DELETE /doctors/${createdDoctorId} ---`);
    const deleteRes = await makeRequest("DELETE", `/doctors/${createdDoctorId}`);
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

    // -------------------------------------------------------------
    // EDGE CASES & ERROR HANDLING
    // -------------------------------------------------------------
    console.log("\n--- 6. Testing Error Cases ---");

    // 6a. GET deleted ID -> 404
    const notFoundRes = await makeRequest("GET", `/doctors/${createdDoctorId}`);
    assert(
      "GET non-existent ID returns HTTP 404 Not Found",
      notFoundRes.statusCode === 404 && notFoundRes.body.success === false,
      `Status: ${notFoundRes.statusCode}, Error: "${notFoundRes.body.error}"`
    );

    // 6b. GET malformed ObjectId -> 400
    const malformedIdRes = await makeRequest("GET", "/doctors/not-a-mongo-id");
    assert(
      "GET with malformed ObjectId returns HTTP 400 Bad Request",
      malformedIdRes.statusCode === 400 && malformedIdRes.body.error.includes("Invalid ID format"),
      `Status: ${malformedIdRes.statusCode}, Error: "${malformedIdRes.body.error}"`
    );

    // 6c. POST missing required fields -> 400
    const invalidPostRes = await makeRequest("POST", "/doctors", { name: "Incomplete Doctor" });
    assert(
      "POST with missing required fields returns HTTP 400 Validation Error",
      invalidPostRes.statusCode === 400 && invalidPostRes.body.error.includes("Validation Error"),
      `Status: ${invalidPostRes.statusCode}, Error: "${invalidPostRes.body.error}"`
    );

    console.log("\n=================================================");
    console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log("=================================================\n");
  } finally {
    // Cleanup test database
    await Doctor.deleteMany({ email: /test.*@medicare\.com/ });
    await disconnectDB();

    // Close server
    await new Promise((res) => server.close(res));
  }
}

if (require.main === module) {
  runDoctorIntegrationTests();
}

module.exports = runDoctorIntegrationTests;
