/**
 * TASK 3 — Register New User with Email Verification
 *
 * Demonstrates async/await syntax, Promise-based timers, and error handling
 * using try/catch blocks within an asynchronous user registration pipeline.
 */

/**
 * Simulates asynchronous email dispatch with a delay
 * @param {string} email - Destination email address
 * @param {number} delayMs - Simulated transmission latency (default 600ms)
 * @returns {Promise<string>}
 */
function sendVerificationEmail(email, delayMs = 600) {
  return new Promise((resolve, reject) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      reject(new Error(`Failed to send email: Invalid email address '${email}'.`));
      return;
    }

    console.log("Sending verification email...");

    setTimeout(() => {
      console.log("Email sent successfully");
      resolve(`Verification token dispatched to ${email}`);
    }, delayMs);
  });
}

/**
 * Registers a new user after verifying input and awaiting email delivery
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @returns {Promise<{ success: boolean, user?: { name: string, email: string }, message: string }>}
 */
async function registerUser(name, email) {
  try {
    // 1. Validate that name exists
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Registration failed: Name is required.");
    }

    // 2. Validate that email exists
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      throw new Error("Registration failed: Email is required.");
    }

    // 3. Await simulated email dispatch
    await sendVerificationEmail(email.trim());

    // 4. Complete registration
    console.log("User registered successfully");

    return {
      success: true,
      user: {
        name: name.trim(),
        email: email.trim()
      },
      message: "User registered successfully"
    };
  } catch (error) {
    console.log(`Registration Error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
async function runRegistrationTests() {
  console.log("=================================================");
  console.log("    TASK 3: USER REGISTRATION TEST SUITE         ");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedCount = 0;

  async function assertRegistration(testName, name, email, expectedSuccess, expectedMessageCheck) {
    totalTests++;
    console.log(`--- [TEST ${totalTests}] ${testName} ---`);
    console.log(`  Inputs: Name="${name}", Email="${email}"`);

    const result = await registerUser(name, email);
    const successMatch = result.success === expectedSuccess;
    const messageMatch = expectedSuccess
      ? result.message && expectedMessageCheck(result.message)
      : result.error && expectedMessageCheck(result.error);

    const passed = successMatch && messageMatch;
    if (passed) passedCount++;

    console.log(`  Outcome: ${result.success ? "SUCCESS" : "FAILED"}`);
    console.log(`  Details: ${result.success ? result.message : result.error}`);
    console.log(`  Result : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
  }

  // Test 1: Valid user registration (expected flow)
  await assertRegistration(
    "Standard valid user registration",
    "John Doe",
    "john.doe@example.com",
    true,
    msg => msg === "User registered successfully"
  );

  // Test 2: Missing name
  await assertRegistration(
    "Missing user name",
    "",
    "john@example.com",
    false,
    err => err.includes("Name is required")
  );

  // Test 3: Missing email
  await assertRegistration(
    "Missing email address",
    "Jane Smith",
    "",
    false,
    err => err.includes("Email is required")
  );

  // Test 4: Invalid email format
  await assertRegistration(
    "Invalid email format (rejected by sendVerificationEmail)",
    "Robert Brown",
    "not-an-email",
    false,
    err => err.includes("Invalid email address")
  );

  console.log("=================================================");
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedCount} | FAILED: ${totalTests - passedCount}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runRegistrationTests();
}

module.exports = {
  sendVerificationEmail,
  registerUser,
  runRegistrationTests
};
