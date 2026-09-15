/**
 * SECTION 2 — Asynchronous Basics (setTimeout)
 *
 * Demonstrates non-blocking timers using setTimeout. JavaScript delegates the timer
 * to the Node.js / Browser runtime, allowing the call stack to remain unblocked
 * until the timer expires and the callback is queued for execution.
 */

// ==========================================
// EXERCISE 1: Hello immediately, World after 2s
// ==========================================
function exercise1() {
  return new Promise((resolve) => {
    console.log("Hello");
    const startTime = Date.now();

    setTimeout(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`World (delivered after ~${elapsed}s)`);
      resolve({ first: "Hello", second: "World", elapsed: Number(elapsed) });
    }, 2000);
  });
}

// ==========================================
// EXERCISE 2: Print 1 through 5 with 1s delays
// ==========================================
function exercise2() {
  return new Promise((resolve) => {
    const printedNumbers = [];
    let current = 1;

    console.log("Starting 1-to-5 countdown (1 second delay between each):");

    function printNext() {
      if (current <= 5) {
        console.log(`  [Timer] Number: ${current} (at +${current}s)`);
        printedNumbers.push(current);
        current++;
        setTimeout(printNext, 1000);
      } else {
        console.log("  [Timer] Countdown complete!");
        resolve(printedNumbers);
      }
    }

    // Schedule the first number after 1 second
    setTimeout(printNext, 1000);
  });
}

// ==========================================
// EXERCISE 3: Loading... immediately, Done after 3s
// ==========================================
function exercise3() {
  return new Promise((resolve) => {
    console.log("Loading...");
    const startTime = Date.now();

    setTimeout(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`Done (completed in ~${elapsed}s)`);
      resolve({ status: "Done", elapsed: Number(elapsed) });
    }, 3000);
  });
}

// ==========================================
// EXERCISE 4: Delayed Message Delivery System
// ==========================================
function exercise4(message = "Your security verification code is 482910", delayMs = 1500) {
  return new Promise((resolve) => {
    const queuedAt = new Date().toISOString();
    console.log(`[DISPATCH] Message queued at ${queuedAt}: "${message}"`);
    console.log(`[DISPATCH] Delivery delay configured: ${delayMs}ms`);

    const start = Date.now();

    setTimeout(() => {
      const deliveredAt = new Date().toISOString();
      const actualDelay = Date.now() - start;
      console.log(`[DELIVERY CONFIRMED] Message received at ${deliveredAt}`);
      console.log(`[DELIVERY CONFIRMED] Content: "${message}"`);
      console.log(`[DELIVERY CONFIRMED] Total latency: ${actualDelay}ms\n`);

      resolve({
        message,
        delayMs,
        actualDelay,
        delivered: true
      });
    }, delayMs);
  });
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
async function runAsynchronousSuite() {
  console.log("=================================================");
  console.log("   SESSION 3: ASYNCHRONOUS BASICS (setTimeout)   ");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(name, condition) {
    total++;
    if (condition) passed++;
    console.log(`[TEST ${total}] ${name} -> ${condition ? "PASS [OK]" : "FAIL [X]"}\n`);
  }

  console.log("--- Running Exercise 1 (2s delay) ---");
  const ex1 = await exercise1();
  assert("Exercise 1 printed Hello immediately and World after ~2 seconds",
    ex1.first === "Hello" && ex1.second === "World" && ex1.elapsed >= 1.8
  );

  console.log("--- Running Exercise 2 (5 x 1s countdown) ---");
  const ex2 = await exercise2();
  assert("Exercise 2 sequentially printed numbers 1 through 5",
    JSON.stringify(ex2) === JSON.stringify([1, 2, 3, 4, 5])
  );

  console.log("--- Running Exercise 3 (3s delay) ---");
  const ex3 = await exercise3();
  assert("Exercise 3 displayed Loading... then Done after ~3 seconds",
    ex3.status === "Done" && ex3.elapsed >= 2.8
  );

  console.log("--- Running Exercise 4 (Delayed Message System) ---");
  const ex4 = await exercise4("Package #TX-9021 has arrived at dispatch depot", 1200);
  assert("Exercise 4 accurately routed delayed message with timestamp metadata",
    ex4.delivered === true && ex4.actualDelay >= 1100
  );

  console.log("=================================================");
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runAsynchronousSuite();
}

module.exports = {
  exercise1,
  exercise2,
  exercise3,
  exercise4,
  runAsynchronousSuite
};
