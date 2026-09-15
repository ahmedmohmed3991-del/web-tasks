/**
 * PROJECT 2 — Check if Array is Sorted
 *
 * Checks whether an array of elements is sorted in ascending (non-decreasing) order.
 *
 * Constraints & Rules:
 * - Uses standard loops and arrays.
 * - Does NOT use Array.prototype.sort().
 * - An array is sorted if for all index i in [0, arr.length - 2]: arr[i] <= arr[i + 1].
 * - Empty arrays and single-element arrays are considered trivially sorted (return true).
 */

/**
 * Determines whether an array is sorted in non-decreasing (ascending) order.
 * @param {Array<number>} arr - Array to check
 * @returns {boolean} true if sorted in ascending order, false otherwise
 */
function isArraySorted(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError("Argument must be an Array.");
  }

  // Trivial cases: empty or single element arrays are always sorted
  if (arr.length <= 1) {
    return true;
  }

  // Loop through array comparing each element with the next
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false; // Found an inversion; not sorted
    }
  }

  return true;
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runArraySortedTests() {
  console.log("=================================================");
  console.log("    CHECK IF ARRAY IS SORTED — TEST SUITE        ");
  console.log("=================================================\n");

  const testCases = [
    {
      description: "Already sorted array (strictly ascending)",
      input: [1, 2, 3, 4, 5],
      expected: true
    },
    {
      description: "Unsorted array with drop in the middle",
      input: [1, 3, 2, 4],
      expected: false
    },
    {
      description: "Sorted array with duplicate adjacent values",
      input: [1, 2, 2, 3, 4, 4, 5],
      expected: true
    },
    {
      description: "Unsorted array with duplicate values out of order",
      input: [3, 1, 3, 2],
      expected: false
    },
    {
      description: "Empty array (trivially sorted)",
      input: [],
      expected: true
    },
    {
      description: "Single-element array (trivially sorted)",
      input: [42],
      expected: true
    },
    {
      description: "Sorted array with negative numbers",
      input: [-10, -5, 0, 3, 7],
      expected: true
    },
    {
      description: "Unsorted array with negative numbers",
      input: [-5, -10, 0, 5],
      expected: false
    },
    {
      description: "Reverse-sorted array (descending)",
      input: [5, 4, 3, 2, 1],
      expected: false
    },
    {
      description: "All identical elements",
      input: [7, 7, 7, 7],
      expected: true
    },
    {
      description: "Floating point numbers sorted",
      input: [1.1, 2.2, 2.25, 3.8],
      expected: true
    },
    {
      description: "Floating point numbers unsorted",
      input: [1.1, 2.25, 2.2, 3.8],
      expected: false
    }
  ];

  let passedCount = 0;

  testCases.forEach((tc, index) => {
    const actual = isArraySorted(tc.input);
    const passed = actual === tc.expected;
    if (passed) passedCount++;

    console.log(`[TEST ${index + 1}] ${tc.description}`);
    console.log(`  - Input    : ${JSON.stringify(tc.input)}`);
    console.log(`  - Expected : ${tc.expected}`);
    console.log(`  - Actual   : ${actual}`);
    console.log(`  - Result   : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
  });

  console.log("=================================================");
  console.log(`TOTAL TESTS: ${testCases.length} | PASSED: ${passedCount} | FAILED: ${testCases.length - passedCount}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runArraySortedTests();
}

module.exports = isArraySorted;
