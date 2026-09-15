/**
 * PROJECT 1 — Online Store Order Processing System
 *
 * Processes customer orders sequentially while enforcing business criteria:
 * - Orders are processed if valid AND stock is available.
 * - Orders are skipped if cancelled, invalid, or stock is unavailable.
 * - System stops processing completely under critical failure conditions:
 *   1. 3 consecutive skipped orders, OR
 *   2. 3 total stock failures.
 * - Displays and returns comprehensive order and revenue analytics.
 */

class OrderProcessor {
  /**
   * Process a batch of customer orders in their original sequence
   * @param {Array<{id: string|number, status: string, stockAvailable: boolean, amount: number}>} orders
   * @returns {{
   *   totalRevenue: number,
   *   successfulOrders: number,
   *   processedOrdersCount: number,
   *   skippedOrdersCount: number,
   *   stoppedEarly: boolean,
   *   stopMessage: string|null,
   *   auditLog: Array<string>
   * }}
   */
  static processOrders(orders) {
    if (!Array.isArray(orders)) {
      throw new TypeError("Orders input must be an array.");
    }

    let totalRevenue = 0;
    let successfulOrders = 0;
    let processedOrdersCount = 0;
    let skippedOrdersCount = 0;
    let consecutiveSkipped = 0;
    let totalStockFailures = 0;
    let stoppedEarly = false;
    let stopMessage = null;
    const auditLog = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      processedOrdersCount++;

      // Track stock availability
      const isStockAvailable = Boolean(order.stockAvailable);
      if (!isStockAvailable) {
        totalStockFailures++;
      }

      const isValidStatus = (order.status || "").toLowerCase() === "valid";
      const isEligible = isValidStatus && isStockAvailable;

      if (isEligible) {
        // Successful order processing
        const amount = typeof order.amount === "number" && !isNaN(order.amount) ? order.amount : 0;
        totalRevenue += amount;
        successfulOrders++;
        consecutiveSkipped = 0; // Reset consecutive skipped counter
        auditLog.push(`Order #${order.id}: PROCESSED successfully (Amount: $${amount.toFixed(2)})`);
      } else {
        // Skipped order handling
        skippedOrdersCount++;
        consecutiveSkipped++;

        let skipReasons = [];
        if (!isValidStatus) skipReasons.push(`Status '${order.status}'`);
        if (!isStockAvailable) skipReasons.push("Stock unavailable");
        auditLog.push(`Order #${order.id}: SKIPPED [${skipReasons.join(", ")}]`);

        // Check Critical Failure Stop Conditions
        const hasThreeConsecutiveSkips = consecutiveSkipped >= 3;
        const hasThreeStockFailures = totalStockFailures >= 3;

        if (hasThreeConsecutiveSkips || hasThreeStockFailures) {
          stoppedEarly = true;
          stopMessage = "System stopped due to critical failure";

          const reasonDetail = hasThreeConsecutiveSkips && hasThreeStockFailures
            ? "(Reached both 3 consecutive skips and 3 stock failures)"
            : hasThreeConsecutiveSkips
              ? "(Reached 3 consecutive skipped orders)"
              : "(Total stock failures reached 3 times)";

          auditLog.push(`[CRITICAL STOP] ${stopMessage} ${reasonDetail}`);
          console.log(`\n>>> ${stopMessage} <<<`);
          break; // Stop processing immediately
        }
      }
    }

    // Round total revenue to avoid IEEE 754 precision issues
    totalRevenue = Math.round((totalRevenue + Number.EPSILON) * 100) / 100;

    return {
      totalRevenue,
      successfulOrders,
      processedOrdersCount,
      skippedOrdersCount,
      stoppedEarly,
      stopMessage,
      auditLog
    };
  }

  /**
   * Format a summary report of the order processing session
   * @param {Object} result
   * @returns {string}
   */
  static formatSummary(result) {
    const lines = [
      "============================================================",
      "             ONLINE STORE ORDER PROCESSING SUMMARY          ",
      "============================================================",
      `Total Revenue            : $${result.totalRevenue.toFixed(2)}`,
      `Successful Orders        : ${result.successfulOrders}`,
      `Processed Orders Count   : ${result.processedOrdersCount}`,
      `Skipped Orders Count     : ${result.skippedOrdersCount}`,
      `Early Termination        : ${result.stoppedEarly ? "YES [TRIGGERED]" : "NO [COMPLETED NORMALLY]"}`,
      result.stopMessage ? `System Stop Message      : "${result.stopMessage}"` : "System Stop Message      : None (All evaluated)",
      "============================================================"
    ];
    return lines.join("\n");
  }
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runOrderProcessingTests() {
  console.log("=================================================");
  console.log("    ORDER PROCESSING SYSTEM — TEST SUITE         ");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedCount = 0;

  function assertOrderBatch(testName, inputOrders, validator) {
    totalTests++;
    const result = OrderProcessor.processOrders(inputOrders);
    const passed = validator(result);
    if (passed) passedCount++;

    console.log(`[TEST ${totalTests}] ${testName}`);
    console.log(`  - Input Orders Count    : ${inputOrders.length}`);
    console.log(`  - Expected Result Check : Validated by test assertion criteria`);
    console.log(`  - Actual Result:`);
    console.log(`      • Total Revenue       : $${result.totalRevenue.toFixed(2)}`);
    console.log(`      • Successful Orders   : ${result.successfulOrders}`);
    console.log(`      • Processed Count     : ${result.processedOrdersCount}`);
    console.log(`      • Skipped Count       : ${result.skippedOrdersCount}`);
    console.log(`      • Stopped Early       : ${result.stoppedEarly}`);
    console.log(`      • Stop Message        : ${result.stopMessage ? `"${result.stopMessage}"` : "null"}`);
    console.log(`  - Result                : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
  }

  // Test 1: All Valid Orders with stock available
  const batch1 = [
    { id: 101, status: "valid", stockAvailable: true, amount: 150 },
    { id: 102, status: "valid", stockAvailable: true, amount: 250 },
    { id: 103, status: "valid", stockAvailable: true, amount: 100 }
  ];
  assertOrderBatch(
    "All valid orders with stock available",
    batch1,
    res => res.totalRevenue === 500 &&
           res.successfulOrders === 3 &&
           res.processedOrdersCount === 3 &&
           res.skippedOrdersCount === 0 &&
           res.stoppedEarly === false &&
           res.stopMessage === null
  );

  // Test 2: Orders with cancelled and invalid statuses (interspersed, not consecutive 3)
  const batch2 = [
    { id: 201, status: "valid", stockAvailable: true, amount: 100 },
    { id: 202, status: "cancelled", stockAvailable: true, amount: 80 },
    { id: 203, status: "valid", stockAvailable: true, amount: 200 },
    { id: 204, status: "invalid", stockAvailable: true, amount: 50 },
    { id: 205, status: "valid", stockAvailable: true, amount: 300 }
  ];
  assertOrderBatch(
    "Interspersed cancelled and invalid orders (resets consecutive skips)",
    batch2,
    res => res.totalRevenue === 600 &&
           res.successfulOrders === 3 &&
           res.processedOrdersCount === 5 &&
           res.skippedOrdersCount === 2 &&
           res.stoppedEarly === false &&
           res.stopMessage === null
  );

  // Test 3: Stock failures below threshold (2 stock failures, completes normally)
  const batch3 = [
    { id: 301, status: "valid", stockAvailable: false, amount: 100 }, // stock fail 1
    { id: 302, status: "valid", stockAvailable: true, amount: 150 },  // success, resets consecutive skip
    { id: 303, status: "valid", stockAvailable: false, amount: 200 }, // stock fail 2
    { id: 304, status: "valid", stockAvailable: true, amount: 350 }   // success
  ];
  assertOrderBatch(
    "Stock failures below threshold (< 3) processes remaining eligible orders",
    batch3,
    res => res.totalRevenue === 500 &&
           res.successfulOrders === 2 &&
           res.processedOrdersCount === 4 &&
           res.skippedOrdersCount === 2 &&
           res.stoppedEarly === false
  );

  // Test 4: Critical Failure — 3 consecutive skipped orders (cancelled, invalid, no-stock)
  const batch4 = [
    { id: 401, status: "valid", stockAvailable: true, amount: 100 },     // success
    { id: 402, status: "cancelled", stockAvailable: true, amount: 50 },  // skip 1
    { id: 403, status: "invalid", stockAvailable: true, amount: 75 },    // skip 2
    { id: 404, status: "valid", stockAvailable: false, amount: 120 },    // skip 3 (triggers stop)
    { id: 405, status: "valid", stockAvailable: true, amount: 500 },     // should NOT be processed
    { id: 406, status: "valid", stockAvailable: true, amount: 300 }      // should NOT be processed
  ];
  assertOrderBatch(
    "Critical Failure: 3 consecutive skipped orders triggers early stop",
    batch4,
    res => res.totalRevenue === 100 &&
           res.successfulOrders === 1 &&
           res.processedOrdersCount === 4 &&
           res.skippedOrdersCount === 3 &&
           res.stoppedEarly === true &&
           res.stopMessage === "System stopped due to critical failure"
  );

  // Test 5: Critical Failure — Total stock failures reach 3 times (even non-consecutive)
  const batch5 = [
    { id: 501, status: "valid", stockAvailable: false, amount: 100 }, // stock fail 1, skip 1
    { id: 502, status: "valid", stockAvailable: true, amount: 200 },  // success 1, resets skip count to 0
    { id: 503, status: "valid", stockAvailable: false, amount: 150 }, // stock fail 2, skip 1
    { id: 504, status: "valid", stockAvailable: true, amount: 300 },  // success 2, resets skip count to 0
    { id: 505, status: "valid", stockAvailable: false, amount: 250 }, // stock fail 3 (triggers stop!)
    { id: 506, status: "valid", stockAvailable: true, amount: 800 }   // should NOT be processed
  ];
  assertOrderBatch(
    "Critical Failure: Total stock failures reach 3 times (non-consecutive)",
    batch5,
    res => res.totalRevenue === 500 &&
           res.successfulOrders === 2 &&
           res.processedOrdersCount === 5 &&
           res.skippedOrdersCount === 3 &&
           res.stoppedEarly === true &&
           res.stopMessage === "System stopped due to critical failure"
  );

  // Test 6: Empty order list
  assertOrderBatch(
    "Empty order list handled cleanly",
    [],
    res => res.totalRevenue === 0 &&
           res.successfulOrders === 0 &&
           res.processedOrdersCount === 0 &&
           res.skippedOrdersCount === 0 &&
           res.stoppedEarly === false &&
           res.stopMessage === null
  );

  console.log("=================================================");
  console.log(`TOTAL ORDER TESTS: ${totalTests} | PASSED: ${passedCount} | FAILED: ${totalTests - passedCount}`);
  console.log("=================================================\n");

  // Demonstration Output
  console.log("DEMONSTRATION RUN: Processing batch with critical failure");
  const demoResult = OrderProcessor.processOrders(batch4);
  console.log(OrderProcessor.formatSummary(demoResult));
}

if (require.main === module) {
  runOrderProcessingTests();
}

module.exports = OrderProcessor;
