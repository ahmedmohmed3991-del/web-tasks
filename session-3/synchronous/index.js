/**
 * SECTION 1 — Synchronous Execution
 *
 * Demonstrates the single-threaded, top-to-bottom nature of synchronous JavaScript.
 * Each operation must complete before the next line of code can be evaluated.
 */

// ==========================================
// EXERCISE 1: Sequential Order Logging
// ==========================================
function exercise1() {
  const output = [];
  const log = (msg) => {
    output.push(msg);
    console.log(msg);
  };

  log("Start");
  log("Middle");
  log("End");

  return output;
}

// ==========================================
// EXERCISE 2: Nested Function Call Stack
// ==========================================
function exercise2() {
  const trace = [];
  const logStep = (step) => {
    trace.push(step);
    console.log(step);
  };

  function childFunction() {
    logStep("  -> [Child] Entered childFunction");
    logStep("  -> [Child] Performing child operation");
    logStep("  -> [Child] Exiting childFunction");
  }

  function parentFunction() {
    logStep("[Parent] Entered parentFunction");
    logStep("[Parent] Calling childFunction...");
    childFunction();
    logStep("[Parent] Resumed parentFunction after child finished");
    logStep("[Parent] Exiting parentFunction");
  }

  parentFunction();
  return trace;
}

// ==========================================
// EXERCISE 3: Sequential Calculations
// ==========================================
function exercise3() {
  console.log("Step 1: Calculating base sum (15 + 25)...");
  const step1 = 15 + 25; // 40
  console.log(`  Result 1 = ${step1}`);

  console.log("Step 2: Multiplying previous result by 2.5 (40 * 2.5)...");
  const step2 = step1 * 2.5; // 100
  console.log(`  Result 2 = ${step2}`);

  console.log("Step 3: Subtracting discount (100 - 18)...");
  const step3 = step2 - 18; // 82
  console.log(`  Result 3 = ${step3}`);

  return { step1, step2, step3 };
}

// ==========================================
// EXERCISE 4: Dependent Functional Flow
// ==========================================
function exercise4() {
  // Function 1: Compute subtotal from items
  function calculateSubtotal(items) {
    let subtotal = 0;
    for (let i = 0; i < items.length; i++) {
      subtotal += items[i].price * items[i].quantity;
    }
    return subtotal;
  }

  // Function 2: Compute sales tax based on subtotal (depends on Function 1)
  function calculateTax(subtotal, taxRate) {
    return Math.round(subtotal * taxRate * 100) / 100;
  }

  // Function 3: Format grand total receipt (depends on Function 1 and Function 2)
  function generateReceipt(customer, items, taxRate = 0.10) {
    const subtotal = calculateSubtotal(items);
    const tax = calculateTax(subtotal, taxRate);
    const grandTotal = subtotal + tax;

    const receipt = {
      customer,
      subtotal,
      tax,
      grandTotal
    };

    console.log(`Receipt for ${customer}: Subtotal $${subtotal}, Tax $${tax}, Total $${grandTotal}`);
    return receipt;
  }

  const sampleItems = [
    { name: "Notebook", price: 12, quantity: 2 },
    { name: "Pen", price: 3, quantity: 4 }
  ];

  return generateReceipt("Jane Doe", sampleItems, 0.08);
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runSynchronousSuite() {
  console.log("=================================================");
  console.log("    SESSION 3: SYNCHRONOUS EXECUTION TESTS       ");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(name, condition) {
    total++;
    if (condition) passed++;
    console.log(`[TEST ${total}] ${name} -> ${condition ? "PASS [OK]" : "FAIL [X]"}\n`);
  }

  console.log("--- Running Exercise 1 ---");
  const ex1Result = exercise1();
  assert("Exercise 1 logs 'Start', 'Middle', 'End' sequentially",
    ex1Result[0] === "Start" && ex1Result[1] === "Middle" && ex1Result[2] === "End"
  );

  console.log("--- Running Exercise 2 ---");
  const ex2Trace = exercise2();
  assert("Exercise 2 preserves call stack order (parent -> child -> parent)",
    ex2Trace[0].includes("Entered parent") &&
    ex2Trace[2].includes("Entered child") &&
    ex2Trace[4].includes("Exiting child") &&
    ex2Trace[6].includes("Exiting parent")
  );

  console.log("--- Running Exercise 3 ---");
  const ex3Math = exercise3();
  assert("Exercise 3 sequential math matches expected pipeline (40 -> 100 -> 82)",
    ex3Math.step1 === 40 && ex3Math.step2 === 100 && ex3Math.step3 === 82
  );

  console.log("--- Running Exercise 4 ---");
  const ex4Receipt = exercise4();
  assert("Exercise 4 dependent function chain correctly calculates totals",
    ex4Receipt.subtotal === 36 && ex4Receipt.tax === 2.88 && ex4Receipt.grandTotal === 38.88
  );

  console.log("=================================================");
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runSynchronousSuite();
}

module.exports = {
  exercise1,
  exercise2,
  exercise3,
  exercise4,
  runSynchronousSuite
};
