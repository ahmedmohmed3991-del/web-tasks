/**
 * LEETCODE PRACTICE — PROBLEM 2: FIND THE INDEX OF THE FIRST OCCURRENCE IN A STRING
 * LeetCode URL: https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
 *
 * Problem Statement:
 * Given two strings `needle` and `haystack`, return the index of the first occurrence
 * of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`.
 *
 * ----------------------------------------------------------------------------
 * Approach Explanation:
 * We implement a custom sliding window substring matcher without relying on built-in
 * helpers like `String.prototype.indexOf()` or `String.prototype.includes()`.
 *
 * Algorithmic Details:
 * 1. Edge Cases:
 *    - If `needle` is empty (""), return 0 (consistent with standard C/POSIX `strstr` and LeetCode specifications).
 *    - If `needle.length > haystack.length`, the needle cannot fit inside the haystack, so return -1 immediately.
 * 2. Sliding Window Boundary:
 *    - Let N = haystack.length and M = needle.length.
 *    - The outer loop only needs to iterate up to index `(N - M)`. Any start index greater
 *      than `(N - M)` leaves fewer than M remaining characters, so matching is impossible.
 * 3. Character-by-Character Matching:
 *    - At each window starting position `i`, compare `haystack[i + j]` with `needle[j]`.
 *    - If a mismatch occurs at any offset `j`, break early to minimize redundant comparisons.
 *    - If all M characters match (`j === M`), return current index `i`.
 * 4. Fallback:
 *    - If the outer loop finishes without finding a match, return -1.
 *
 * Complexity Analysis:
 * - Time Complexity:
 *   - Worst-case: O((N - M + 1) * M), occurring with repetitive prefixes (e.g., haystack = "aaaaaaaaab", needle = "aaab").
 *   - Average / Best-case: O(N), as mismatches typically break after the first or second character.
 * - Space Complexity:
 *   - O(1) auxiliary space, as the comparison uses index pointers without allocating substrings or additional arrays.
 * ----------------------------------------------------------------------------
 */

/**
 * Finds the index of the first occurrence of needle in haystack
 * @param {string} haystack
 * @param {string} needle
 * @returns {number}
 */
function strStr(haystack, needle) {
  // Edge Case 1: Empty needle returns 0
  if (needle === "") {
    return 0;
  }

  const n = haystack.length;
  const m = needle.length;

  // Edge Case 2: Needle is longer than haystack
  if (m > n) {
    return -1;
  }

  // Iterate over every potential starting position
  // Stop at (n - m) because needle cannot fit thereafter
  const maxStart = n - m;
  for (let i = 0; i <= maxStart; i++) {
    // Quick first-character check optimization
    if (haystack[i] !== needle[0]) {
      continue;
    }

    let match = true;
    for (let j = 1; j < m; j++) {
      if (haystack[i + j] !== needle[j]) {
        match = false;
        break;
      }
    }

    if (match) {
      return i;
    }
  }

  return -1;
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runFirstOccurrenceTests() {
  console.log("=================================================");
  console.log(" LEETCODE: FIRST OCCURRENCE IN STRING — TESTS   ");
  console.log("=================================================\n");

  const testCases = [
    { haystack: "sadbutsad", needle: "sad", expected: 0, desc: "Needle at the very beginning" },
    { haystack: "leetcode", needle: "leeto", expected: -1, desc: "Needle does not exist in haystack" },
    { haystack: "hello", needle: "ll", expected: 2, desc: "Needle located in the middle" },
    { haystack: "programming", needle: "ing", expected: 8, desc: "Needle located at the very end" },
    { haystack: "a", needle: "a", expected: 0, desc: "Single character identical match" },
    { haystack: "abc", needle: "abcd", expected: -1, desc: "Needle longer than haystack" },
    { haystack: "anything", needle: "", expected: 0, desc: "Empty needle returns 0" },
    { haystack: "mississippi", needle: "issip", expected: 4, desc: "Repeated prefixes ('issip' in 'mississippi')" },
    { haystack: "aaaaa", needle: "bba", expected: -1, desc: "Uniform characters with no match" },
    { haystack: "mississippi", needle: "pi", expected: 9, desc: "Match at tail with repetitive letters" },
    { haystack: "CaseSensitive", needle: "case", expected: -1, desc: "Case-sensitive mismatch" }
  ];

  let passedCount = 0;

  testCases.forEach((tc, index) => {
    const actual = strStr(tc.haystack, tc.needle);
    const passed = actual === tc.expected;
    if (passed) passedCount++;

    console.log(`[TEST ${index + 1}] ${tc.desc}`);
    console.log(`  - Haystack : "${tc.haystack}"`);
    console.log(`  - Needle   : "${tc.needle}"`);
    console.log(`  - Expected : ${tc.expected}`);
    console.log(`  - Actual   : ${actual}`);
    console.log(`  - Result   : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
  });

  console.log("=================================================");
  console.log(`TOTAL TESTS: ${testCases.length} | PASSED: ${passedCount} | FAILED: ${testCases.length - passedCount}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runFirstOccurrenceTests();
}

module.exports = strStr;
