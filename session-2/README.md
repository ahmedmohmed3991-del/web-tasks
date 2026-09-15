# SESSION 2 — Loops and Arrays

Comprehensive implementation of **Session 2: Loops and Arrays**, featuring:
1. An **Online Store Order Processing System** with critical failure early termination rules.
2. A **Check if Array is Sorted** algorithm implemented strictly using loops without `Array.prototype.sort()`.
3. A **Return Numbers Greater Than a Value** filtering algorithm implemented strictly using loops without `Array.prototype.filter()`.

---

## 📁 Project Structure

```
session-2/
├── README.md
├── order-processing/
│   └── index.js
├── array-sorted/
│   └── index.js
└── numbers-greater-than/
    └── index.js
```

---

## 🚀 How to Run Each Challenge

All programs are self-contained and run using standard Node.js without any third-party dependencies:

```bash
# Project 1: Online Store Order Processing System
node session-2/order-processing/index.js

# Project 2: Check if Array is Sorted
node session-2/array-sorted/index.js

# Project 3: Return Numbers Greater Than a Value
node session-2/numbers-greater-than/index.js
```

---

## 🛒 Project 1 — Online Store Order Processing System (`order-processing/index.js`)

### Objective
Simulate processing incoming customer orders sequentially in their original order, computing revenue, counting successful and skipped transactions, and triggering an emergency shutdown if critical failure thresholds are reached.

### Order Data Structure
```typescript
interface Order {
  id: string | number;
  status: "valid" | "cancelled" | "invalid";
  stockAvailable: boolean;
  amount: number;
}
```

### Business Rules & Processing Criteria
- **Process Order**: An order is processed if and only if `status === "valid"` AND `stockAvailable === true`.
  - When processed: Add `order.amount` to `totalRevenue`, increment `successfulOrders`, and reset the consecutive skipped orders counter to `0`.
- **Skip Order**: An order is skipped if:
  - `status === "cancelled"`, OR
  - `status === "invalid"`, OR
  - `stockAvailable === false`.
  - When skipped: Increment `skippedOrdersCount` and increment `consecutiveSkipped`.
- **Stock Failures**: Whenever `stockAvailable === false`, increment `totalStockFailures`.

### Critical Failure Stop Conditions
Processing stops completely and immediately if:
1. **3 skipped orders occur consecutively** (`consecutiveSkipped >= 3`), OR
2. **Total stock failures reach 3 times** across the session (`totalStockFailures >= 3`).

When either condition is triggered:
- Display: `"System stopped due to critical failure"`
- Halt any further order processing, preserving the exact state at the point of failure.

### Output Metrics
The system calculates and displays:
- `totalRevenue`: Sum of amounts from processed orders.
- `successfulOrders`: Count of successfully processed orders.
- `processedOrdersCount`: Number of orders evaluated before completion or early termination.
- `skippedOrdersCount`: Number of skipped orders.
- `stopMessage`: Critical failure message if terminated early (`"System stopped due to critical failure"`), or `null`.

### Test Coverage (6 Scenarios)
1. **All Valid Orders**: 3 valid orders processed completely without skips.
2. **Interspersed Cancellations**: Cancelled and invalid orders separated by valid orders (consecutive skips reset properly).
3. **Stock Failures Below Threshold**: 2 stock failures (< 3) with remaining eligible orders successfully processed.
4. **Early Termination (3 Consecutive Skips)**: 3 consecutive non-valid/no-stock orders halt the system immediately before processing subsequent orders.
5. **Early Termination (3 Total Stock Failures)**: 3 non-consecutive out-of-stock events trigger system shutdown.
6. **Empty Order List**: Handles empty array input gracefully with zeroed statistics.

---

## 🔢 Project 2 — Check if Array is Sorted (`array-sorted/index.js`)

### Objective
Verify whether an array of numeric values is sorted in ascending (non-decreasing) order using iterative loop constructs without calling `Array.prototype.sort()`.

### Algorithmic Approach
- An array is sorted ascending if for every adjacent pair at index $i$:
  $$\text{arr}[i] \le \text{arr}[i + 1] \quad \forall \; 0 \le i < \text{arr.length} - 1$$
- The function iterates from index $0$ to $\text{length} - 2$.
- If any $\text{arr}[i] > \text{arr}[i + 1]$, the function immediately returns `false` (early exit).
- If the loop completes without finding an inversion, returns `true`.

### Edge Cases Covered
- **Empty Array (`[]`)**: Trivially sorted $\to$ `true`.
- **Single-Element Array (`[42]`)**: Trivially sorted $\to$ `true`.
- **Duplicates**: Adjacent duplicates (`[1, 2, 2, 3]`) are valid non-decreasing order $\to$ `true`.
- **Negative Numbers**: Properly handles signed comparisons (`[-10, -5, 0, 5]`) $\to$ `true`.
- **Reverse-Sorted**: Strict descending order (`[5, 4, 3, 2, 1]`) $\to$ `false`.
- **Identical Elements**: Array of identical numbers (`[7, 7, 7]`) $\to$ `true`.
- **Floating Point Numbers**: Decimal accuracy verification.

### Test Coverage
12 automated test cases verifying both valid and invalid array orders.

---

## 🎯 Project 3 — Return Numbers Greater Than a Value (`numbers-greater-than/index.js`)

### Objective
Filter an array of numbers to extract only elements strictly greater than a target value. Per requirements, this is implemented using traditional loops without relying on `Array.prototype.filter()` or external libraries.

### Algorithmic Approach
- Accepts an array `numbers` and a numeric `target`.
- Initializes an empty result array `result = []`.
- Iterates through the collection using an index-based `for` loop.
- Asserts strict inequality: `currentNumber > target`.
- Appends qualifying elements to `result` while preserving their original order.
- Returns the filtered result array.

### Edge Cases Covered
- **Strict Inequality Boundary**: Elements equal to `target` (e.g., `5 === 5`) are excluded.
- **Empty Array**: Returns `[]`.
- **No Matching Values**: Returns `[]` when all values are less than or equal to `target`.
- **All Matching Values**: Preserves full array.
- **Negative Numbers & Targets**: Validates negative value math (e.g., `-2 > -4`).
- **Duplicate Qualifying Values**: Duplicates strictly greater than target are retained in order.
- **Floating Point Values**: Handles fractional comparisons accurately.

### Test Coverage
9 automated test cases covering empty, boundary, negative, and mixed scenarios.

---

## 📊 Summary of Test Results

| Project | File Path | Tests Executed | Passed | Failed | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Project 1: Order Processing System | `session-2/order-processing/index.js` | 6 | 6 | 0 | **PASS** |
| Project 2: Check if Array is Sorted | `session-2/array-sorted/index.js` | 12 | 12 | 0 | **PASS** |
| Project 3: Return Numbers Greater Than | `session-2/numbers-greater-than/index.js` | 9 | 9 | 0 | **PASS** |
| **TOTAL** | | **27** | **27** | **0** | **100% PASS** |
