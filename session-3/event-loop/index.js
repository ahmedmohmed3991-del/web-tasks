/**
 * SECTION 3 — JavaScript Runtime & Event Loop
 *
 * Demonstrates how the Call Stack, Node.js APIs (Timer thread), Callback Queue (Macrotasks),
 * and the Event Loop interact.
 *
 * Key Concept:
 * Synchronous code executes immediately on the Call Stack.
 * Asynchronous callbacks (like setTimeout) are placed into the Callback Queue when their
 * timer completes. The Event Loop only pushes callbacks from the Callback Queue onto the
 * Call Stack WHEN THE CALL STACK IS COMPLETELY EMPTY.
 */

// ==========================================
// EXERCISE 1: Event Loop Baseline
// ==========================================
/**
 * Expected Execution Order:
 * 1. "1: Synchronous start"
 * 2. "3: Synchronous end"
 * 3. "2: Asynchronous timeout callback (50ms)"
 *
 * Explanation:
 * console.log('1') executes on the Call Stack immediately.
 * setTimeout delegates the 50ms timer and callback to the runtime.
 * console.log('3') executes synchronously on the Call Stack.
 * After 50ms, the callback moves to the Callback Queue.
 * Once the Call Stack is empty, the Event Loop pushes the callback onto the Call Stack.
 */
function exercise1() {
  const expectedOrder = [
    "1: Synchronous start",
    "3: Synchronous end",
    "2: Asynchronous timeout callback (50ms)"
  ];
  const actualOrder = [];

  return new Promise((resolve) => {
    actualOrder.push("1: Synchronous start");
    console.log("1: Synchronous start");

    setTimeout(() => {
      actualOrder.push("2: Asynchronous timeout callback (50ms)");
      console.log("2: Asynchronous timeout callback (50ms)");

      resolve({
        expectedOrder,
        actualOrder,
        isMatch: JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)
      });
    }, 50);

    actualOrder.push("3: Synchronous end");
    console.log("3: Synchronous end");
  });
}

// ==========================================
// EXERCISE 2: setTimeout with 0ms Delay
// ==========================================
/**
 * Why do synchronous messages execute before setTimeout(..., 0)?
 *
 * Answer:
 * Even with a delay of 0ms, setTimeout is inherently asynchronous.
 * Calling setTimeout(fn, 0) does NOT mean "execute immediately".
 * It means "register this callback with the runtime and queue it for the next tick".
 * The callback is placed into the Macrotask / Callback Queue.
 * The Event Loop will NEVER move a callback from the queue to the Call Stack
 * until all currently running synchronous code has completed and the stack is empty.
 */
function exercise2() {
  const expectedOrder = [
    "Sync Step A: Before zero-delay timer",
    "Sync Step B: After zero-delay timer declared",
    "Sync Step C: Final synchronous statement",
    "Async Step D: setTimeout with 0ms delay executed"
  ];
  const actualOrder = [];

  return new Promise((resolve) => {
    actualOrder.push("Sync Step A: Before zero-delay timer");
    console.log("Sync Step A: Before zero-delay timer");

    setTimeout(() => {
      actualOrder.push("Async Step D: setTimeout with 0ms delay executed");
      console.log("Async Step D: setTimeout with 0ms delay executed");

      resolve({
        expectedOrder,
        actualOrder,
        isMatch: JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)
      });
    }, 0);

    actualOrder.push("Sync Step B: After zero-delay timer declared");
    console.log("Sync Step B: After zero-delay timer declared");

    actualOrder.push("Sync Step C: Final synchronous statement");
    console.log("Sync Step C: Final synchronous statement");
  });
}

// ==========================================
// EXERCISE 3: Line-by-line Synchronous Priority
// ==========================================
/**
 * Demonstrates that synchronous execution strictly adheres to line-by-line flow
 * while multiple asynchronous calls are queued.
 */
function exercise3() {
  const expectedOrder = [
    "Line 1: Initialize process",
    "Line 2: Compute math (10 * 10 = 100)",
    "Line 3: Process array transformation",
    "Line 4: Process completed synchronously",
    "Queue 1: Async notification (Timer 1 finished)",
    "Queue 2: Async notification (Timer 2 finished)"
  ];
  const actualOrder = [];

  return new Promise((resolve) => {
    actualOrder.push("Line 1: Initialize process");
    console.log("Line 1: Initialize process");

    // Queue Timer 1 (10ms)
    setTimeout(() => {
      actualOrder.push("Queue 1: Async notification (Timer 1 finished)");
      console.log("Queue 1: Async notification (Timer 1 finished)");
    }, 10);

    // Synchronous lines execute strictly in sequence
    const mathResult = 10 * 10;
    actualOrder.push(`Line 2: Compute math (10 * 10 = ${mathResult})`);
    console.log(`Line 2: Compute math (10 * 10 = ${mathResult})`);

    // Queue Timer 2 (20ms)
    setTimeout(() => {
      actualOrder.push("Queue 2: Async notification (Timer 2 finished)");
      console.log("Queue 2: Async notification (Timer 2 finished)");

      resolve({
        expectedOrder,
        actualOrder,
        isMatch: JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)
      });
    }, 20);

    const mapped = [1, 2, 3].map(x => x * 2);
    actualOrder.push("Line 3: Process array transformation");
    console.log("Line 3: Process array transformation");

    actualOrder.push("Line 4: Process completed synchronously");
    console.log("Line 4: Process completed synchronously");
  });
}

// ==========================================
// EXERCISE 4: Call Stack Starvation / Blocking
// ==========================================
/**
 * Demonstrates how an asynchronous callback with a 10ms timer is delayed
 * if the main Call Stack is blocked by a heavy synchronous task.
 */
function exercise4() {
  return new Promise((resolve) => {
    console.log("\n[Ex 4] Scheduling timer for 10ms...");
    const timerScheduledAt = Date.now();
    let callbackExecutedAt = 0;

    setTimeout(() => {
      callbackExecutedAt = Date.now();
      const delay = callbackExecutedAt - timerScheduledAt;
      console.log(`[Ex 4 Callback] Timer fired after ${delay}ms!`);
      console.log("  -> Notice: Even though the timer requested 10ms, it had to wait for the synchronous loop to finish.");
      resolve({
        requestedDelay: 10,
        actualDelay: delay,
        wasDelayedByStack: delay >= 40
      });
    }, 10);

    console.log("[Ex 4] Simulating heavy synchronous work on Call Stack (~80ms CPU burn)...");
    const blockStart = Date.now();
    // Busy-wait loop blocking the single thread Call Stack for ~80ms
    while (Date.now() - blockStart < 80) {
      // Blocking Call Stack
    }
    console.log(`[Ex 4] Synchronous block finished in ${Date.now() - blockStart}ms. Call Stack is now FREE.`);
  });
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
async function runEventLoopSuite() {
  console.log("=================================================");
  console.log("   SESSION 3: RUNTIME & EVENT LOOP TESTS         ");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(name, condition, expected, actual) {
    total++;
    if (condition) passed++;
    console.log(`[TEST ${total}] ${name}`);
    if (expected && actual) {
      console.log(`  - Expected Order: ${JSON.stringify(expected)}`);
      console.log(`  - Actual Order  : ${JSON.stringify(actual)}`);
    }
    console.log(`  - Result: ${condition ? "PASS [OK]" : "FAIL [X]"}\n`);
  }

  console.log("--- Running Exercise 1: Standard Event Loop Order ---");
  const ex1 = await exercise1();
  assert("Exercise 1 execution order matches expected", ex1.isMatch, ex1.expectedOrder, ex1.actualOrder);

  console.log("--- Running Exercise 2: setTimeout(fn, 0) Priority ---");
  const ex2 = await exercise2();
  assert("Exercise 2 zero-delay callback runs AFTER all synchronous logs", ex2.isMatch, ex2.expectedOrder, ex2.actualOrder);

  console.log("--- Running Exercise 3: Line-by-Line Synchronous Priority ---");
  const ex3 = await exercise3();
  assert("Exercise 3 synchronous operations complete before timer callbacks", ex3.isMatch, ex3.expectedOrder, ex3.actualOrder);

  console.log("--- Running Exercise 4: Call Stack Starvation / Blocking ---");
  const ex4 = await exercise4();
  assert("Exercise 4 shows callback had to wait for blocking synchronous loop", ex4.wasDelayedByStack);

  console.log("=================================================");
  console.log(`TOTAL EVENT LOOP TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runEventLoopSuite();
}

module.exports = {
  exercise1,
  exercise2,
  exercise3,
  exercise4,
  runEventLoopSuite
};
