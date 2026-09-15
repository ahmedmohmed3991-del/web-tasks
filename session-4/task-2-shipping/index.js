/**
 * TASK 2 — Calculate Shipping Cost
 *
 * Demonstrates business validation within a Promise, calculating costs on valid
 * inputs and rejecting on invalid or non-positive weights using .then() and .catch().
 */

/**
 * Calculates shipping cost based on weight (weight * 5)
 * @param {number} weight - Weight in kilograms
 * @returns {Promise<number>}
 */
function calculateShipping(weight) {
  return new Promise((resolve, reject) => {
    // Check if input is a valid number
    if (typeof weight !== "number" || isNaN(weight)) {
      reject(new Error("Invalid weight: Weight must be a valid numeric value."));
      return;
    }

    // Zero or negative weight must reject the request
    if (weight <= 0) {
      reject(new Error(`Invalid weight: Weight must be greater than zero. Received: ${weight}`));
      return;
    }

    const shippingCost = weight * 5;
    resolve(shippingCost);
  });
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runShippingTests() {
  console.log("=================================================");
  console.log("     TASK 2: CALCULATE SHIPPING COST TESTS       ");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedCount = 0;

  function assertShipping(testName, weight, shouldResolve, validator) {
    totalTests++;
    return calculateShipping(weight)
      .then((cost) => {
        const passed = shouldResolve && validator(cost);
        if (passed) passedCount++;

        console.log(`[TEST ${totalTests}] ${testName}`);
        console.log(`  - Weight Input    : ${weight}`);
        console.log(`  - Outcome         : RESOLVED (Cost: $${cost})`);
        console.log(`  - Result          : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
      })
      .catch((err) => {
        const passed = !shouldResolve && validator(err);
        if (passed) passedCount++;

        console.log(`[TEST ${totalTests}] ${testName}`);
        console.log(`  - Weight Input    : ${weight}`);
        console.log(`  - Outcome         : REJECTED ("${err.message}")`);
        console.log(`  - Result          : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
      });
  }

  return assertShipping(
    "Positive integer weight (10 kg -> $50)",
    10,
    true,
    cost => cost === 50
  )
    .then(() =>
      assertShipping(
        "Positive decimal weight (2.5 kg -> $12.5)",
        2.5,
        true,
        cost => cost === 12.5
      )
    )
    .then(() =>
      assertShipping(
        "Zero weight (0 kg -> Rejection)",
        0,
        false,
        err => err.message.includes("must be greater than zero")
      )
    )
    .then(() =>
      assertShipping(
        "Negative weight (-5 kg -> Rejection)",
        -5,
        false,
        err => err.message.includes("must be greater than zero")
      )
    )
    .then(() =>
      assertShipping(
        "Non-numeric string weight ('heavy' -> Rejection)",
        "heavy",
        false,
        err => err.message.includes("must be a valid numeric value")
      )
    )
    .then(() => {
      console.log("=================================================");
      console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedCount} | FAILED: ${totalTests - passedCount}`);
      console.log("=================================================\n");

      // Assignment requested demonstration
      console.log("ASSIGNMENT DEMONSTRATION FLOW:");
      console.log("Executing: calculateShipping(10).then(...).catch(...)");
      return calculateShipping(10)
        .then((cost) => {
          console.log(`Shipping cost: ${cost}`);
        })
        .catch((error) => {
          console.log(`Error: ${error.message}`);
        });
    });
}

if (require.main === module) {
  runShippingTests();
}

module.exports = {
  calculateShipping,
  runShippingTests
};
