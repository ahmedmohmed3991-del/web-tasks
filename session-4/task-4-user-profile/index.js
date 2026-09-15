/**
 * TASK 4 — Fetch User Profile from API
 *
 * Demonstrates native fetch(), async/await, JSON parsing, HTTP response validation
 * (checking response.ok / response.status), non-existing user handling (404),
 * and network fault resilience via try/catch blocks.
 */

const API_BASE_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * Fetches user profile by ID from JSONPlaceholder API
 * @param {number|string} id - User ID
 * @param {Function} [fetchFn=fetch] - Optional fetch implementation (supports dependency injection for testing)
 * @returns {Promise<{ success: boolean, data?: { name: string, email: string }, error?: string }>}
 */
async function getUserProfile(id, fetchFn = fetch) {
  try {
    // Basic ID validation
    if (id === undefined || id === null || id === "" || isNaN(Number(id)) || Number(id) <= 0) {
      throw new Error(`Invalid user ID: '${id}'. ID must be a positive number.`);
    }

    const targetUrl = `${API_BASE_URL}/${id}`;

    // Perform HTTP GET request
    const response = await fetchFn(targetUrl);

    // CRITICAL: fetch() does NOT reject on HTTP 4xx or 5xx responses.
    // We must manually inspect response.ok and response.status!
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP Error 404: User with ID ${id} not found.`);
      } else {
        throw new Error(`HTTP Error ${response.status}: Failed to retrieve profile from server (${response.statusText || "Unknown"}).`);
      }
    }

    // Parse JSON body
    const user = await response.json();

    // Verify expected fields exist
    if (!user || typeof user !== "object" || !user.name || !user.email) {
      throw new Error("Invalid payload: API response did not contain expected 'name' and 'email' fields.");
    }

    // Display user name and email as required
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  } catch (error) {
    // Handle both HTTP error responses and network/fetch failures
    console.log(`Error fetching user profile: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
async function runUserProfileTests() {
  console.log("=================================================");
  console.log("    TASK 4: FETCH USER PROFILE API TESTS         ");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedCount = 0;

  function assertResult(testName, result, expectedSuccess, validator) {
    totalTests++;
    const successMatch = result.success === expectedSuccess;
    const valueMatch = validator(result);
    const passed = successMatch && valueMatch;
    if (passed) passedCount++;

    console.log(`[TEST ${totalTests}] ${testName}`);
    console.log(`  - Success Status: ${result.success}`);
    if (result.success) {
      console.log(`  - Retrieved Name : "${result.data.name}"`);
      console.log(`  - Retrieved Email: "${result.data.email}"`);
    } else {
      console.log(`  - Handled Error : "${result.error}"`);
    }
    console.log(`  - Result        : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
  }

  // Mock fetch responses for deterministic local testing (also compatible with sandbox environments)
  const mockHttpFetch = async (url) => {
    const idMatch = url.match(/\/users\/(\d+)$/);
    const id = idMatch ? Number(idMatch[1]) : null;

    if (id === 1) {
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz"
        })
      };
    } else if (id === 2) {
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({
          id: 2,
          name: "Ervin Howell",
          username: "Antonette",
          email: "Shanna@melissa.tv"
        })
      };
    } else if (id === 999) {
      // Non-existing user returns 404 Not Found
      return {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({})
      };
    } else if (id === 500) {
      return {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({})
      };
    }

    return {
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({})
    };
  };

  // Mock network crash fetch (simulating DNS failure / timeout)
  const mockNetworkFailFetch = async () => {
    throw new TypeError("fetch failed: ConnectTimeoutError (network unreachable)");
  };

  // Test 1: Existing user (ID 1)
  console.log("--- Fetching Existing User ID 1 ---");
  const res1 = await getUserProfile(1, mockHttpFetch);
  assertResult(
    "Existing user profile retrieval (ID 1)",
    res1,
    true,
    r => r.data && r.data.name === "Leanne Graham" && r.data.email === "Sincere@april.biz"
  );

  // Test 2: Existing user (ID 2)
  console.log("--- Fetching Existing User ID 2 ---");
  const res2 = await getUserProfile(2, mockHttpFetch);
  assertResult(
    "Existing user profile retrieval (ID 2)",
    res2,
    true,
    r => r.data && r.data.name === "Ervin Howell"
  );

  // Test 3: Non-existing user (ID 999 -> 404)
  console.log("--- Fetching Non-Existing User ID 999 ---");
  const res3 = await getUserProfile(999, mockHttpFetch);
  assertResult(
    "Non-existing user handling (HTTP 404)",
    res3,
    false,
    r => r.error && r.error.includes("HTTP Error 404")
  );

  // Test 4: Server error (HTTP 500)
  console.log("--- Handling Server HTTP 500 ---");
  const res4 = await getUserProfile(500, mockHttpFetch);
  assertResult(
    "Server HTTP error handling (HTTP 500)",
    res4,
    false,
    r => r.error && r.error.includes("HTTP Error 500")
  );

  // Test 5: Network/Connection Failure handling
  console.log("--- Handling Network Connection Error ---");
  const res5 = await getUserProfile(1, mockNetworkFailFetch);
  assertResult(
    "Network failure handling (DNS/timeout)",
    res5,
    false,
    r => r.error && r.error.includes("fetch failed")
  );

  // Test 6: Invalid User ID input validation
  console.log("--- Handling Invalid User ID (-1) ---");
  const res6 = await getUserProfile(-1, mockHttpFetch);
  assertResult(
    "Invalid input ID handling (negative number)",
    res6,
    false,
    r => r.error && r.error.includes("Invalid user ID")
  );

  console.log("=================================================");
  console.log(`TOTAL USER PROFILE TESTS: ${totalTests} | PASSED: ${passedCount} | FAILED: ${totalTests - passedCount}`);
  console.log("=================================================\n");

  // Demonstration output required in assignment
  console.log("ASSIGNMENT DEMONSTRATION FLOW:");
  console.log("Calling getUserProfile(1):");
  await getUserProfile(1, mockHttpFetch);
}

if (require.main === module) {
  runUserProfileTests();
}

module.exports = {
  getUserProfile,
  runUserProfileTests
};
