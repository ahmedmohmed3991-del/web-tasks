/**
 * PROJECT 3 — Return Numbers Greater Than a Value
 *
 * Filters an array to extract only numbers strictly greater than a specified target.
 *
 * Constraints & Rules:
 * - Uses standard loops and array indexing.
 * - Does NOT use Array.prototype.filter() or external libraries.
 * - Matches strictly greater elements (num > target). Elements equal to the target are excluded.
 * - Preserves the relative order of elements from the original array.
 */

/**
 * Returns all numbers from an array that are strictly greater than the target value.
 * @param {Array<number>} numbers - Input array of numbers
 * @param {number} target - Threshold target value
 * @returns {Array<number>} New array containing only values strictly greater than target
 */
function getNumbersGreaterThan(numbers, target) {
  if (!Array.isArray(numbers)) {
    throw new TypeError("First argument must be an Array.");
  }
  if (typeof target !== "number" || isNaN(target)) {
    throw new TypeError("Target value must be a valid number.");
  }

  const result = [];

  for (let i = 0; i < numbers.length; i++) {
    const currentNumber = numbers[i];
    // Filter condition: strictly greater than target
    if (typeof currentNumber === "number" && !isNaN(currentNumber) && currentNumber > target) {
      result.push(currentNumber);
    }
  }

  return result;
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runNumbersGreaterThanTests() {
  console.log("=================================================");
  console.log("  RETURN NUMBERS GREATER THAN A VALUE — TESTS    ");
  console.log("=================================================\n");

  const testCases = [
    {
      description: "Empty array returns empty array",
      numbers: [],
      target: 5,
      expected: []
    },
    {
      description: "No matching values (all smaller than target)",
      numbers: [1, 2, 3, 4],
      target: 5,
      expected: []
    },
    {
      description: "All values greater than target",
      numbers: [10, 20, 30, 40],
      target: 5,
      expected: [10, 20, 30, 40]
    },
    {
      description: "Negative numbers with negative target",
      numbers: [-10, -5, -2, 0, 3],
      target: -4,
      expected: [-2, 0, 3]
    },
    {
      description: "Duplicate numbers greater than target",
      numbers: [5, 10, 10, 2, 15, 10],
      target: 5,
      expected: [10, 10, 15, 10]
    },
    {
      description: "Values exactly equal to target are excluded (strictly greater)",
      numbers: [5, 5, 5, 5],
      target: 5,
      expected: []
    },
    {
      description: "Mixed array with values above, equal to, and below target",
      numbers: [1, 5, 10, 5, 20, 3],
      target: 5,
      expected: [10, 20]
    },
    {
      description: "Floating point numbers comparison",
      numbers: [1.2, 3.5, 0.8, 1.2, 2.7],
      target: 1.2,
      expected: [3.5, 2.7]
    },
    {
      description: "Zero target boundary with positive and negative numbers",
      numbers: [-3, -1, 0, 1, 4],
      target: 0,
      expected: [1, 4]
    }
  ];

  let passedCount = 0;

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  testCases.forEach((tc, index) => {
    const actual = getNumbersGreaterThan(tc.numbers, tc.target);
    const passed = arraysEqual(actual, tc.expected);
    if (passed) passedCount++;

    console.log(`[TEST ${index + 1}] ${tc.description}`);
    console.log(`  - Input Numbers : ${JSON.stringify(tc.numbers)}`);
    console.log(`  - Target Value  : ${tc.target}`);
    console.log(`  - Expected      : ${JSON.stringify(tc.expected)}`);
    console.log(`  - Actual        : ${JSON.stringify(actual)}`);
    console.log(`  - Result        : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
  });

  console.log("=================================================");
  console.log(`TOTAL TESTS: ${testCases.length} | PASSED: ${passedCount} | FAILED: ${testCases.length - passedCount}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runNumbersGreaterThanTests();
}

module.exports = getNumbersGreaterThan;
