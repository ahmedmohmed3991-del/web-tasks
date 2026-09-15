/**
 * LEETCODE PRACTICE — PROBLEM 1: VALID PARENTHESES
 * LeetCode URL: https://leetcode.com/problems/valid-parentheses/
 *
 * Problem Statement:
 * Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']',
 * determine if the input string is valid.
 *
 * An input string is valid if:
 * 1. Open brackets must be closed by the same type of brackets.
 * 2. Open brackets must be closed in the correct order.
 * 3. Every close bracket has a corresponding open bracket of the same type.
 *
 * ----------------------------------------------------------------------------
 * Approach Explanation:
 * We use a Last-In, First-Out (LIFO) Stack data structure alongside an opening-to-closing
 * bracket lookup mapping.
 *
 * Optimization & Logic:
 * 1. Parity Check: If the string length is odd, it can never form balanced pairs,
 *    so we return `false` immediately in O(1) time.
 * 2. Traversal: As we iterate over each character:
 *    - When encountering an opening bracket ('(', '{', '['), we push its expected
 *      closing counterpart onto our stack.
 *    - When encountering a closing bracket, we pop the top element from the stack.
 *      If the stack was already empty (no matching open bracket) or the popped element
 *      does not strictly equal the current character, the string violates order and is invalid.
 * 3. Final Verification: After traversing the entire string, the stack must be empty.
 *    If any elements remain, there are unclosed opening brackets.
 *
 * Complexity Analysis:
 * - Time Complexity : O(N) where N is the length of the string. We iterate through the
 *   string once, and stack operations (push, pop) run in O(1) constant time.
 * - Space Complexity: O(N) in the worst case (e.g., all opening brackets like "((((("),
 *   where the stack holds up to N elements.
 * ----------------------------------------------------------------------------
 */

/**
 * Determine if brackets in string s are balanced and valid
 * @param {string} s
 * @returns {boolean}
 */
function isValid(s) {
  // Guard clause: strings with odd lengths can never be fully paired
  if (typeof s !== "string" || s.length % 2 !== 0) {
    return false;
  }

  // Bracket matching map: maps opening bracket to expected closing bracket
  const bracketMap = {
    "(": ")",
    "{": "}",
    "[": "]"
  };

  const stack = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (bracketMap[char]) {
      // If it is an open bracket, push the expected closing bracket
      stack.push(bracketMap[char]);
    } else {
      // If it is a closing bracket, verify it matches the top of the stack
      const expectedClosing = stack.pop();
      if (char !== expectedClosing) {
        return false;
      }
    }
  }

  // Valid if and only if all opened brackets were successfully closed
  return stack.length === 0;
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runValidParenthesesTests() {
  console.log("=================================================");
  console.log("  LEETCODE: VALID PARENTHESES — TEST SUITE       ");
  console.log("=================================================\n");

  const testCases = [
    { input: "()", expected: true, description: "Simple single pair parentheses" },
    { input: "()[]{}", expected: true, description: "Multiple valid sequential bracket pairs" },
    { input: "(]", expected: false, description: "Mismatched closing bracket type" },
    { input: "([)]", expected: false, description: "Interleaved incorrect closing order" },
    { input: "{[]}", expected: true, description: "Properly nested bracket pairs" },
    { input: "", expected: true, description: "Empty string (trivially balanced)" },
    { input: "(", expected: false, description: "Single opening bracket (odd length)" },
    { input: "]", expected: false, description: "Single closing bracket with empty stack" },
    { input: "((((((", expected: false, description: "All opening brackets unclosed" },
    { input: "))))))", expected: false, description: "All closing brackets without open" },
    { input: "{[()()]}", expected: true, description: "Complex nested structure" },
    { input: "{[(])}", expected: false, description: "Deeply nested invalid order" }
  ];

  let passedCount = 0;

  testCases.forEach((tc, index) => {
    const actual = isValid(tc.input);
    const passed = actual === tc.expected;
    if (passed) passedCount++;

    console.log(`[TEST ${index + 1}] ${tc.description}`);
    console.log(`  - Input    : "${tc.input}"`);
    console.log(`  - Expected : ${tc.expected}`);
    console.log(`  - Actual   : ${actual}`);
    console.log(`  - Result   : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
  });

  console.log("=================================================");
  console.log(`TOTAL TESTS: ${testCases.length} | PASSED: ${passedCount} | FAILED: ${testCases.length - passedCount}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runValidParenthesesTests();
}

module.exports = isValid;
