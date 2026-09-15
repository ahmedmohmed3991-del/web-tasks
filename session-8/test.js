/**
 * SESSION 8 — Automated Test Suite for Library Book Management API
 *
 * Starts the native HTTP server and executes HTTP requests verifying:
 * 1. GET /books (200 OK)
 * 2. POST /books with exact assignment payload (201 Created)
 * 3. DELETE /books/:id (200 OK)
 * 4. Error case: DELETE non-existing ID (404 Not Found)
 * 5. Error case: POST invalid JSON payload (400 Bad Request)
 * 6. Error case: Invalid route (404 Not Found)
 * 7. Persistence: Verification that books.json reflects disk updates
 */

const http = require("http");
const fs = require("fs");
const { server, DATA_FILE_PATH } = require("./server");

const TEST_PORT = 3050;

/**
 * Helper to make HTTP requests
 */
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      ...headers
    };

    if (body && typeof body === "string") {
      defaultHeaders["Content-Type"] = "application/json";
      defaultHeaders["Content-Length"] = Buffer.byteLength(body);
    }

    const req = http.request(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path,
        method,
        headers: defaultHeaders
      },
      (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk.toString();
        });
        res.on("end", () => {
          let parsedBody = null;
          try {
            parsedBody = JSON.parse(responseData);
          } catch {
            parsedBody = responseData;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsedBody
          });
        });
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runApiTests() {
  console.log("=================================================");
  console.log("   SESSION 8: LIBRARY BOOK REST API TEST SUITE   ");
  console.log("=================================================\n");

  // Start test server
  await new Promise((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`[Test Setup] Server running on http://localhost:${TEST_PORT}\n`);
      resolve();
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

  try {
    // -------------------------------------------------------------
    // TEST 1: GET /books
    // -------------------------------------------------------------
    console.log("--- 1. Testing GET /books ---");
    const getRes = await makeRequest("GET", "/books");
    assert(
      "GET /books returns HTTP 200 and JSON array",
      getRes.statusCode === 200 && Array.isArray(getRes.body),
      `Status: ${getRes.statusCode}, Stored Books Count: ${getRes.body.length}`
    );

    // -------------------------------------------------------------
    // TEST 2: POST /books with assignment payload
    // -------------------------------------------------------------
    console.log("\n--- 2. Testing POST /books ---");
    const payload = JSON.stringify({
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      price: 300,
      available: true
    });
    const postRes = await makeRequest("POST", "/books", payload);
    const createdBook = postRes.body;
    assert(
      "POST /books returns HTTP 201 Created and new book with auto-generated ID",
      postRes.statusCode === 201 &&
      createdBook &&
      createdBook.id !== undefined &&
      createdBook.title === "JavaScript: The Good Parts",
      `Status: ${postRes.statusCode}, Assigned ID: ${createdBook.id}, Title: "${createdBook.title}"`
    );

    // Verify disk persistence after POST
    const diskBooksAfterPost = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf-8"));
    assert(
      "Persistence check: newly posted book exists in books.json file",
      diskBooksAfterPost.some((b) => b.id === createdBook.id),
      `Total books on disk: ${diskBooksAfterPost.length}`
    );

    // -------------------------------------------------------------
    // TEST 3: DELETE /books/:id
    // -------------------------------------------------------------
    console.log(`\n--- 3. Testing DELETE /books/${createdBook.id} ---`);
    const deleteRes = await makeRequest("DELETE", `/books/${createdBook.id}`);
    assert(
      "DELETE /books/:id returns HTTP 200 OK and confirms deletion",
      deleteRes.statusCode === 200 && deleteRes.body.message.includes("successfully"),
      `Status: ${deleteRes.statusCode}, Message: "${deleteRes.body.message}"`
    );

    // Verify disk persistence after DELETE
    const diskBooksAfterDelete = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf-8"));
    assert(
      "Persistence check: deleted book is removed from books.json file",
      !diskBooksAfterDelete.some((b) => b.id === createdBook.id),
      `Total books on disk: ${diskBooksAfterDelete.length}`
    );

    // -------------------------------------------------------------
    // TEST 4: DELETE non-existing ID (404 Not Found)
    // -------------------------------------------------------------
    console.log("\n--- 4. Testing DELETE /books/9999 (Non-existent ID) ---");
    const deleteNotFoundRes = await makeRequest("DELETE", "/books/9999");
    assert(
      "DELETE /books/9999 returns HTTP 404 Not Found",
      deleteNotFoundRes.statusCode === 404 && deleteNotFoundRes.body.error.includes("not found"),
      `Status: ${deleteNotFoundRes.statusCode}, Error: "${deleteNotFoundRes.body.error}"`
    );

    // -------------------------------------------------------------
    // TEST 5: POST invalid JSON request body (400 Bad Request)
    // -------------------------------------------------------------
    console.log("\n--- 5. Testing POST /books with malformed JSON body ---");
    const badJsonRes = await makeRequest("POST", "/books", "{ bad json: ");
    assert(
      "POST /books with invalid JSON returns HTTP 400 Bad Request",
      badJsonRes.statusCode === 400 && badJsonRes.body.error.includes("Invalid JSON"),
      `Status: ${badJsonRes.statusCode}, Error: "${badJsonRes.body.error}"`
    );

    // -------------------------------------------------------------
    // TEST 6: Invalid Route (404 Not Found)
    // -------------------------------------------------------------
    console.log("\n--- 6. Testing GET /unknown-endpoint ---");
    const unknownRouteRes = await makeRequest("GET", "/unknown-endpoint");
    assert(
      "GET /unknown-endpoint returns HTTP 404 Not Found",
      unknownRouteRes.statusCode === 404 && unknownRouteRes.body.error.includes("Route not found"),
      `Status: ${unknownRouteRes.statusCode}, Error: "${unknownRouteRes.body.error}"`
    );

    console.log("\n=================================================");
    console.log(`TOTAL API TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log("=================================================\n");
  } finally {
    // Close server cleanly
    server.close();
  }
}

if (require.main === module) {
  runApiTests();
}

module.exports = runApiTests;
