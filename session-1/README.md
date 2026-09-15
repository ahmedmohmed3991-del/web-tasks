# SESSION 1 — JavaScript Fundamentals

Comprehensive implementation of **Session 1: JavaScript Fundamentals**, featuring three real-world mini-applications and two LeetCode algorithms with self-contained logic, security features, discount calculations, academic policies, and automated test runners.

---

## 📁 Project Structure

```
session-1/
├── README.md
├── atm/
│   └── index.js
├── ecommerce-checkout/
│   └── index.js
├── student-portal/
│   └── index.js
└── leetcode/
    ├── valid-parentheses.js
    └── first-occurrence.js
```

---

## 🚀 How to Run Each Challenge

All challenges and algorithms are self-contained and run using standard Node.js without third-party dependencies:

```bash
# Challenge 1: ATM Banking System
node session-1/atm/index.js

# Challenge 2: E-Commerce Checkout System
node session-1/ecommerce-checkout/index.js

# Challenge 3: University Student Portal
node session-1/student-portal/index.js

# LeetCode Problem 1: Valid Parentheses
node session-1/leetcode/valid-parentheses.js

# LeetCode Problem 2: First Occurrence in String
node session-1/leetcode/first-occurrence.js
```

---

## 🏦 Challenge 1 — ATM Banking System (`atm/index.js`)

### Objective
Simulate an ATM banking console application with PIN verification, transactions (deposit, withdrawal, balance inquiry), PIN changes, and an automated security lockout policy.

### Stored State
- **`userPin`**: Current 4-digit PIN string.
- **`currentBalance`**: Real-time monetary balance.
- **`selectedOperation`**: Currently executed operation (`CHECK_BALANCE`, `DEPOSIT`, `WITHDRAW`, `CHANGE_PIN`).
- **`transactionAmount`**: Amount transferred in current operation.
- **`failedAttempts`**: Counter tracking consecutive invalid PIN attempts.
- **`isLocked`**: Boolean flag indicating if the account has been disabled.

### Business Rules & Edge Cases
1. **PIN Authentication**: Every operation validates the entered PIN.
2. **Consecutive Lockout (Bonus)**: After **3 consecutive failed PIN attempts**, the account locks automatically. Subsequent operations (even with the correct PIN) are rejected. Successful authentication resets the failed counter.
3. **Withdrawal Protection**: Prevents withdrawing more than the current available balance, or negative/zero amounts.
4. **Deposit Validation**: Deposits must be positive numbers greater than 0.
5. **PIN Format Validation**: When changing PIN, the new PIN must be exactly 4 numeric digits (`/^\d{4}$/`) and cannot be identical to the current PIN.
6. **Descriptive Messaging**: Every operation returns structured `{ success, message, ... }` responses.

### Test Coverage (16 Automated Tests)
- Valid balance checks and post-operation balances.
- Deposits: positive, zero ($0), and negative amounts.
- Withdrawals: within balance, exceeding balance (overdraft check), and negative amounts.
- PIN change: non-numeric characters, invalid length (5 digits), successful update, verification that old PIN is revoked and new PIN is active.
- Security lockout: 3 consecutive failed PIN attempts locking the account, and rejection of subsequent operations on locked accounts.

---

## 🛒 Challenge 2 — E-Commerce Checkout System (`ecommerce-checkout/index.js`)

### Objective
Process customer orders with stacked discounts, promotional voucher codes, payment method incentives, value-added tax (VAT), negative price protection, and itemized invoice generation.

### Stored State & Inputs
- **`customerName`**: Name of customer.
- **`productCategory`**: Product category classification.
- **`productPrice`**: Unit price of the item.
- **`quantity`**: Positive integer quantity.
- **`couponCode`**: Optional promotional coupon string.
- **`paymentMethod`**: Payment method used (`LOYALTY_POINTS`, `DEBIT_CARD`, `CRYPTO`, `CREDIT_CARD`, `CASH`).

### Configured Rates & Calculations
- **Subtotal**: `productPrice * quantity`
- **Category Discounts**:
  - `ELECTRONICS`: 10%
  - `CLOTHING`: 15%
  - `BOOKS`: 5%
  - `GROCERIES`: 2%
  - `HOME`: 8%
  - Other: 0%
- **Coupons**:
  - `SAVE10`: 10% discount
  - `SUPER20`: 20% discount
  - `MEGA50`: 50% discount
  - `FLAT100`: $100.00 flat voucher
  - Invalid/Unrecognized: 0%
- **Payment Method Discounts**:
  - `LOYALTY_POINTS`: 5%
  - `DEBIT_CARD`: 3%
  - `CRYPTO`: 2%
  - `CREDIT_CARD` / `CASH`: 0%
- **Negative Price Protection (Bonus)**:
  - Total Deductions = Category Discount + Coupon Discount + Payment Discount.
  - If total deductions exceed the subtotal, net taxable price is clamped to **`$0.00`**.
- **VAT**: 14% applied to the net taxable amount.
- **Grand Total**: `Net Taxable Amount + VAT`.
- All financial values are rounded to 2 decimal places using IEEE 754 epsilon correction.

### Test Coverage (6 Automated Tests + Invoice Output)
- Multi-discount stacking (Category + Coupon + Payment method).
- Invalid/expired coupon handling.
- Flat dollar vouchers.
- Bonus clamp: discount exceeding price clamped to $0.00 without negative totals or negative VAT.
- Input validation: negative price rejection and non-positive quantity rejection.
- Printable invoice layout demonstration.

---

## 🎓 Challenge 3 — University Student Portal (`student-portal/index.js`)

### Objective
Evaluate student course grades with attendance enforcement, financial clearance validation, letter grading, academic standing classifications, and merit scholarship awards.

### Stored State & Inputs
- **`studentName`**: Name of student.
- **`attendancePercentage`**: Lecture attendance rate (0% - 100%).
- **`midtermScore`**: Exam score (0 - 100).
- **`finalExamScore`**: Exam score (0 - 100).
- **`assignmentScore`**: Coursework score (0 - 100).
- **`tuitionPaymentStatus`**: Financial clearance indicator (`"PAID"` or `"UNPAID"`).

### Grading Policies & Academic Rules
1. **Attendance Requirement**: Minimum **75% attendance** required. If attendance is below 75%, student **automatically fails** (`letterGrade: "F"`, `academicStatus: "FAILED — ATTENDANCE BREACH"`), regardless of test scores.
2. **Tuition Hold**: If tuition is `UNPAID`, academic results are withheld (`accessGranted: false`) with a financial clearance notice.
3. **Coursework Weights**:
   - Midterm Exam: **30%**
   - Final Exam: **50%**
   - Assignments: **20%**
   - Total Weighted Score = `(Midterm * 0.3) + (Final * 0.5) + (Assignment * 0.2)`
4. **Letter Grade Thresholds** (for students with >= 75% attendance):
   - **A** (90% – 100%): Honors / Excellent Standing
   - **B** (80% – 89.99%): Good Standing
   - **C** (70% – 79.99%): Satisfactory Standing
   - **D** (60% – 69.99%): Academic Warning
   - **F** (< 60%): Failed — Academic Deficiency
5. **Merit Scholarship Eligibility (Bonus)**:
   - **Presidential Merit Scholarship (100% Tuition Waiver)**: Total Score >= 92% AND Attendance >= 90%.
   - **Dean's Excellence Award (50% Tuition Waiver)**: Total Score >= 85% AND Attendance >= 85%.

### Test Coverage (8 Automated Tests + Transcript Output)
- High-achieving student qualifying for Presidential Merit Scholarship.
- Dean's Excellence Award qualification.
- Regular passing student with Good Standing.
- Automatic failure triggered by low attendance (< 75%) despite 95% coursework scores.
- Unpaid tuition access blocking.
- Boundary attendance check (exactly 75.0%).
- Input validation: rejection of negative scores or scores exceeding 100%.

---

## 🧩 LeetCode Practice

### Problem 1: Valid Parentheses (`leetcode/valid-parentheses.js`)
- **LeetCode URL**: [https://leetcode.com/problems/valid-parentheses/](https://leetcode.com/problems/valid-parentheses/)
- **Approach**:
  - Utilizes a Last-In, First-Out (LIFO) Stack.
  - Quick parity check: odd-length strings are immediately rejected in $O(1)$ time.
  - When encountering an opening bracket (`(`, `{`, `[`), pushes the corresponding expected closing bracket onto the stack.
  - When encountering a closing bracket, pops the top of the stack and asserts equality in $O(1)$ time.
  - Valid if the stack is completely empty after iterating through the string.
- **Complexity**:
  - **Time Complexity**: $O(N)$ — Single pass over string of length $N$.
  - **Space Complexity**: $O(N)$ — Stack stores up to $N$ characters in the worst case.
- **Tests**: 12 test cases covering simple pairs, sequential pairs, wrong closing order, interleaved brackets, empty string, odd length, unclosed brackets, and deep nesting.

---

### Problem 2: First Occurrence in a String (`leetcode/first-occurrence.js`)
- **LeetCode URL**: [https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)
- **Approach**:
  - Custom sliding window string search algorithm implemented without using built-in methods (`indexOf`, `includes`).
  - Boundary check: If needle is longer than haystack ($M > N$), returns -1 immediately. If needle is empty, returns 0.
  - Slides a window of size $M$ from index $0$ to $(N - M)$.
  - Optimizes by comparing the first character before entering inner loop comparisons. Breaks early upon mismatch.
  - Returns the first starting index $i$ where all characters match; returns -1 if no match is found.
- **Complexity**:
  - **Time Complexity**: $O((N - M + 1) \times M)$ worst-case (e.g. repeated prefixes); $O(N)$ average/best case.
  - **Space Complexity**: $O(1)$ auxiliary memory using direct index pointers.
- **Tests**: 11 test cases covering needle at start, middle, end, not found, single character, empty needle, needle longer than haystack, repeated prefixes (`mississippi`), and case sensitivity.

---

## 📊 Summary of Test Results

| Module | Test Suite File | Tests Executed | Passed | Failed |
| :--- | :--- | :---: | :---: | :---: |
| Challenge 1: ATM Banking System | `session-1/atm/index.js` | 16 | 16 | 0 |
| Challenge 2: E-Commerce Checkout | `session-1/ecommerce-checkout/index.js` | 6 | 6 | 0 |
| Challenge 3: University Student Portal | `session-1/student-portal/index.js` | 8 | 8 | 0 |
| LeetCode: Valid Parentheses | `session-1/leetcode/valid-parentheses.js` | 12 | 12 | 0 |
| LeetCode: First Occurrence in String | `session-1/leetcode/first-occurrence.js` | 11 | 11 | 0 |
| **TOTAL** | | **53** | **53** | **0** |
