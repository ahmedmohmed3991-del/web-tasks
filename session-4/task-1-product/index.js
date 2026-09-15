/**
 * TASK 1 — Fetch Product Information
 *
 * Demonstrates basic Promise creation, resolution, rejection, and
 * consumption using .then() and .catch().
 */

// Simulated product database
const products = {
  1: "Laptop",
  2: "Phone",
  3: "Tablet"
};

/**
 * Retrieves product name by ID using a Promise
 * @param {number|string} id - Product ID
 * @returns {Promise<string>}
 */
function getProduct(id) {
  return new Promise((resolve, reject) => {
    // Validate input ID
    if (id === undefined || id === null || id === "") {
      reject(new Error("Invalid input: Product ID is required."));
      return;
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      reject(new Error(`Invalid input: Product ID '${id}' must be a valid number.`));
      return;
    }

    // Lookup in database
    if (products[numericId]) {
      resolve(products[numericId]);
    } else {
      reject(new Error(`Product with ID ${numericId} not found.`));
    }
  });
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runProductTests() {
  console.log("=================================================");
  console.log("     TASK 1: FETCH PRODUCT INFORMATION TESTS     ");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedCount = 0;

  function assertPromise(testName, promiseFunc, shouldResolve, expectedOutputCheck) {
    totalTests++;
    return promiseFunc()
      .then((result) => {
        const passed = shouldResolve && expectedOutputCheck(result);
        if (passed) passedCount++;

        console.log(`[TEST ${totalTests}] ${testName}`);
        console.log(`  - Expected State  : RESOLVED`);
        console.log(`  - Actual State    : RESOLVED`);
        console.log(`  - Value Received  : "${result}"`);
        console.log(`  - Result          : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
      })
      .catch((error) => {
        const passed = !shouldResolve && expectedOutputCheck(error);
        if (passed) passedCount++;

        console.log(`[TEST ${totalTests}] ${testName}`);
        console.log(`  - Expected State  : REJECTED`);
        console.log(`  - Actual State    : REJECTED`);
        console.log(`  - Error Message   : "${error.message}"`);
        console.log(`  - Result          : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
      });
  }

  // Execute test cases in sequence
  return assertPromise(
    "Fetch existing product with ID 2 ('Phone')",
    () => getProduct(2),
    true,
    res => res === "Phone"
  )
    .then(() =>
      assertPromise(
        "Fetch existing product with ID 1 ('Laptop')",
        () => getProduct(1),
        true,
        res => res === "Laptop"
      )
    )
    .then(() =>
      assertPromise(
        "Fetch existing product with ID 3 ('Tablet')",
        () => getProduct(3),
        true,
        res => res === "Tablet"
      )
    )
    .then(() =>
      assertPromise(
        "Fetch non-existing product with ID 99 (Rejection)",
        () => getProduct(99),
        false,
        err => err.message.includes("Product with ID 99 not found")
      )
    )
    .then(() =>
      assertPromise(
        "Fetch with non-numeric ID ('abc') (Rejection)",
        () => getProduct("abc"),
        false,
        err => err.message.includes("must be a valid number")
      )
    )
    .then(() => {
      console.log("=================================================");
      console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedCount} | FAILED: ${totalTests - passedCount}`);
      console.log("=================================================\n");

      // Demonstration example requested in assignment
      console.log("ASSIGNMENT DEMONSTRATION FLOW:");
      console.log("Executing: getProduct(2).then(...).catch(...)");
      return getProduct(2)
        .then((product) => {
          console.log(`Output: ${product}`);
        })
        .catch((error) => {
          console.log(`Output: ${error}`);
        });
    });
}

if (require.main === module) {
  runProductTests();
}

module.exports = {
  products,
  getProduct,
  runProductTests
};
