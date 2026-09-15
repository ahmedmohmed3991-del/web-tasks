/**
 * SECTION 4 — Callback Functions
 *
 * Demonstrates functional programming and asynchronous patterns using Callback functions.
 * A callback is a function passed as an argument to another function, intended to be
 * invoked either synchronously or asynchronously once a specific task completes.
 */

// ==========================================
// EXERCISE 1: Greeting Callback
// ==========================================
/**
 * Greets a user and invokes the provided callback function
 * @param {string} name
 * @param {Function} callback
 */
function greetUser(name, callback) {
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function.");
  }
  const greeting = `Hello, ${name}! Welcome to the platform.`;
  console.log(`[Greeting] ${greeting}`);
  return callback(greeting, name);
}

// ==========================================
// EXERCISE 2: Calculator Callback
// ==========================================
/**
 * Calculator function that delegates arithmetic to an operation callback
 * @param {number} a
 * @param {number} b
 * @param {Function} operationCallback
 * @returns {number}
 */
function calculate(a, b, operationCallback) {
  if (typeof a !== "number" || typeof b !== "number" || isNaN(a) || isNaN(b)) {
    throw new TypeError("Both operands must be valid numbers.");
  }
  if (typeof operationCallback !== "function") {
    throw new TypeError("Operation must be a callback function.");
  }
  return operationCallback(a, b);
}

// Supported operation callbacks
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;

// ==========================================
// EXERCISE 3: Data Loading Callback
// ==========================================
/**
 * Simulates fetching user data asynchronously and invokes a completion callback
 * @param {number|string} userId
 * @param {Function} callback - Node-style callback: (err, data) => void
 * @param {number} delayMs - Simulated latency
 */
function loadUserData(userId, callback, delayMs = 150) {
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function.");
  }

  console.log(`[Data Loader] Initiating query for user ID: ${userId}...`);

  setTimeout(() => {
    if (!userId || userId === "invalid") {
      console.log(`[Data Loader] Error: User ID '${userId}' not found.`);
      callback(new Error(`User with ID '${userId}' was not found.`), null);
      return;
    }

    const mockDatabase = {
      101: { id: 101, name: "Alice Adams", role: "Administrator", active: true },
      102: { id: 102, name: "Bob Builder", role: "Engineer", active: true }
    };

    const record = mockDatabase[userId] || { id: userId, name: "Guest User", role: "Member", active: false };
    console.log(`[Data Loader] Query complete. Retrieved record for: ${record.name}`);
    callback(null, record);
  }, delayMs);
}

// ==========================================
// EXERCISE 4: Authentication Flow
// ==========================================
/**
 * Callback-based authentication pipeline
 * @param {{ username: string, password: string }} credentials
 * @param {Function} onSuccess - Callback invoked on successful authentication
 * @param {Function} onFailure - Callback invoked on authentication failure
 */
function authenticate(credentials, onSuccess, onFailure) {
  if (!credentials || typeof credentials !== "object") {
    onFailure("Invalid credentials payload.");
    return;
  }

  const { username, password } = credentials;

  // Simulate credential validation
  const validUsers = {
    admin: "secret123",
    student: "pass2026"
  };

  if (validUsers[username] && validUsers[username] === password) {
    const userSession = {
      username,
      token: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      authenticatedAt: new Date().toISOString()
    };
    onSuccess(userSession);
  } else {
    onFailure(`Authentication failed: Invalid credentials for user '${username}'.`);
  }
}

/**
 * Higher-level authentication flow runner
 * login -> success message -> next step (e.g. load profile / dashboard)
 */
function runAuthPipeline(credentials) {
  return new Promise((resolve) => {
    console.log(`[Auth Flow] Attempting login for '${credentials?.username}'...`);

    authenticate(
      credentials,
      // Success Callback
      (session) => {
        console.log(`  -> [SUCCESS] Logged in successfully! Session token: ${session.token}`);
        // Next Step
        const nextStepResult = `Loaded user dashboard for ${session.username}`;
        console.log(`  -> [NEXT STEP] ${nextStepResult}`);
        resolve({ success: true, session, nextStep: nextStepResult });
      },
      // Failure Callback
      (errorMsg) => {
        console.log(`  -> [DENIED] ${errorMsg}`);
        const nextStepResult = "Redirected to error page / password reset";
        console.log(`  -> [NEXT STEP] ${nextStepResult}`);
        resolve({ success: false, error: errorMsg, nextStep: nextStepResult });
      }
    );
  });
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
async function runCallbacksSuite() {
  console.log("=================================================");
  console.log("       SESSION 3: CALLBACK FUNCTIONS TESTS       ");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(name, condition) {
    total++;
    if (condition) passed++;
    console.log(`[TEST ${total}] ${name} -> ${condition ? "PASS [OK]" : "FAIL [X]"}\n`);
  }

  // Exercise 1: Greeting Callback
  console.log("--- Running Exercise 1: Greeting Callback ---");
  let greetingCallbackExecuted = false;
  const greetResult = greetUser("Sarah Connor", (greeting, name) => {
    greetingCallbackExecuted = true;
    return `Acknowledged: ${name}`;
  });
  assert("Exercise 1 greeting callback executed and returned value",
    greetingCallbackExecuted === true && greetResult === "Acknowledged: Sarah Connor"
  );

  // Exercise 2: Calculator Callback (Add, Subtract, Multiply)
  console.log("--- Running Exercise 2: Calculator Callback ---");
  const sum = calculate(12, 8, add);
  const diff = calculate(20, 7, subtract);
  const prod = calculate(6, 7, multiply);
  console.log(`  Add(12, 8)       = ${sum}`);
  console.log(`  Subtract(20, 7)  = ${diff}`);
  console.log(`  Multiply(6, 7)   = ${prod}`);
  assert("Exercise 2 calculator supports Add, Subtract, and Multiply callbacks",
    sum === 20 && diff === 13 && prod === 42
  );

  // Exercise 3: Data Loading Callback
  console.log("--- Running Exercise 3: Data Loading Callback ---");
  const loadSuccess = await new Promise((res) => {
    loadUserData(101, (err, user) => {
      res(!err && user.name === "Alice Adams" && user.role === "Administrator");
    }, 50);
  });
  assert("Exercise 3 successfully loads and passes data via callback", loadSuccess);

  const loadError = await new Promise((res) => {
    loadUserData("invalid", (err, user) => {
      res(err instanceof Error && user === null);
    }, 50);
  });
  assert("Exercise 3 handles error conditions via callback", loadError);

  // Exercise 4: Authentication Flow (Success and Failure)
  console.log("--- Running Exercise 4: Authentication Flow ---");
  const authSuccess = await runAuthPipeline({ username: "admin", password: "secret123" });
  assert("Exercise 4 auth flow: successful login triggers success and next step",
    authSuccess.success === true && authSuccess.session.username === "admin"
  );

  const authFailure = await runAuthPipeline({ username: "admin", password: "wrongpassword" });
  assert("Exercise 4 auth flow: invalid login triggers failure and recovery step",
    authFailure.success === false && authFailure.error.includes("Authentication failed")
  );

  console.log("=================================================");
  console.log(`TOTAL CALLBACK TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runCallbacksSuite();
}

module.exports = {
  greetUser,
  calculate,
  add,
  subtract,
  multiply,
  loadUserData,
  authenticate,
  runAuthPipeline,
  runCallbacksSuite
};
