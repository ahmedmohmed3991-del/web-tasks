# SESSION 4 — JavaScript Promises, Async/Await & Fetch Tasks

Comprehensive implementation of **Session 4: Asynchronous JavaScript (Promises, Async/Await, and Fetch API)**, featuring:
1. **Task 1 — Fetch Product Information**: Promise creation, resolution, rejection, and `.then()` / `.catch()` chaining.
2. **Task 2 — Calculate Shipping Cost**: Numeric business validation inside Promises with error rejection.
3. **Task 3 — Register New User with Email Verification**: Async/await orchestration, non-blocking timers with `setTimeout`, and `try/catch` error management.
4. **Task 4 — Fetch User Profile from API**: Modern HTTP requests via native `fetch()`, JSON payload parsing, explicit HTTP status checks (`response.ok` / `response.status`), and network error resilience.

---

## 📁 Project Structure

```
session-4/
├── README.md
├── task-1-product/
│   └── index.js
├── task-2-shipping/
│   └── index.js
├── task-3-registration/
│   └── index.js
└── task-4-user-profile/
    └── index.js
```

---

## 🚀 How to Run Each Task

All files are self-contained and run using standard Node.js without requiring third-party libraries:

```bash
# Task 1: Fetch Product Information
node session-4/task-1-product/index.js

# Task 2: Calculate Shipping Cost
node session-4/task-2-shipping/index.js

# Task 3: Register User with Email Verification
node session-4/task-3-registration/index.js

# Task 4: Fetch User Profile from API
node session-4/task-4-user-profile/index.js
```

---

## 📚 Core JavaScript Concepts Explained

### 1. Promise Creation & States
A `Promise` represents the eventual completion or failure of an asynchronous operation. A Promise exists in one of three states:
- **Pending**: Initial state before completion or rejection.
- **Fulfilled**: Operation completed successfully (`resolve(value)` was called).
- **Rejected**: Operation failed or encountered an error (`reject(error)` was called).

```javascript
function examplePromise() {
  return new Promise((resolve, reject) => {
    if (/* success */) {
      resolve("Success data");
    } else {
      reject(new Error("Operation failed"));
    }
  });
}
```

### 2. `.then()` and `.catch()`
- **`.then(onFulfilled)`**: Attaches a callback executed when the Promise transitions to the *Fulfilled* state.
- **`.catch(onRejected)`**: Catches any rejection or uncaught runtime error thrown anywhere along the Promise chain.

```javascript
getProduct(2)
  .then((product) => console.log(product))
  .catch((error) => console.log(error));
```

### 3. `async` / `await` Syntax
`async` and `await` provide cleaner, synchronous-looking syntax over Promises:
- Placing `async` before a function declaration causes it to automatically return a Promise.
- `await` pauses execution of the `async` function until the awaited Promise resolves or rejects, without blocking the main JavaScript thread.

### 4. `try` / `catch` with Async/Await
When an awaited Promise rejects, it throws an exception. Wrapping `await` calls in a `try/catch` block enables localized, robust error recovery:

```javascript
async function registerUser(name, email) {
  try {
    await sendVerificationEmail(email);
    console.log("User registered successfully");
  } catch (error) {
    console.log(`Registration Error: ${error.message}`);
  }
}
```

### 5. `setTimeout` in Async Workflows
`setTimeout()` schedules a callback in the runtime Timer thread. By wrapping `setTimeout` inside a Promise, delays can be awaited natively:

```javascript
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### 6. Native `fetch()` & HTTP Error Handling
**CRITICAL RULE**: Unlike libraries like Axios, the standard `fetch()` API **does NOT reject** on HTTP 4xx or 5xx status codes (such as 404 Not Found or 500 Internal Server Error). `fetch()` only rejects on network failures (e.g. DNS failure, connection timeout, offline socket).

Therefore, application code must explicitly check:
```javascript
const response = await fetch(url);

if (!response.ok) {
  // response.ok is true if response.status is in the range 200-299
  if (response.status === 404) {
    throw new Error(`Resource not found (HTTP 404)`);
  }
  throw new Error(`Server returned HTTP ${response.status}`);
}

const data = await response.json();
```

---

## 🛠️ Task Summaries & Business Rules

### Task 1 — Fetch Product Information (`task-1-product/index.js`)
- **Database**: `{ 1: "Laptop", 2: "Phone", 3: "Tablet" }`.
- Resolves product name if ID exists.
- Rejects with descriptive error if ID is invalid, non-numeric, or absent.
- **Automated Tests**: 5 tests verifying existing products, non-existing ID, invalid format, and assignment demonstration output (`Phone`).

### Task 2 — Calculate Shipping Cost (`task-2-shipping/index.js`)
- **Formula**: `Shipping cost = weight * 5`.
- Rejects weights $\le 0$ or non-numeric values.
- Resolves positive weights with calculated monetary amount.
- **Automated Tests**: 5 tests verifying positive integers, decimal weights, zero weight, negative weight, and non-numeric inputs.

### Task 3 — Register New User with Email Verification (`task-3-registration/index.js`)
- `sendVerificationEmail(email)`: Simulates email transmission delay, logging `"Sending verification email..."` and resolving with `"Email sent successfully"`.
- `registerUser(name, email)`: Validates name and email parameters, awaits email dispatch, and logs `"User registered successfully"`.
- **Automated Tests**: 4 tests verifying standard success flow, missing name, missing email, and invalid email formatting.

### Task 4 — Fetch User Profile from API (`task-4-user-profile/index.js`)
- Targets `https://jsonplaceholder.typicode.com/users/{id}`.
- Uses `fetch()`, `async/await`, and `try/catch`.
- Inspects `response.ok` and `response.status` to catch 404 and 500 responses.
- Displays `Name: <name>` and `Email: <email>` on success.
- Gracefully handles network outages, DNS failures, and invalid IDs.
- **Automated Tests**: 6 tests verifying existing users (ID 1 & ID 2), 404 non-existing user, 500 server error, network failure, and input validation.

---

## 📊 Summary of Test Results

| Task | File Path | Tests Executed | Passed | Failed | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Task 1: Fetch Product Information | `session-4/task-1-product/index.js` | 5 | 5 | 0 | **PASS** |
| Task 2: Calculate Shipping Cost | `session-4/task-2-shipping/index.js` | 5 | 5 | 0 | **PASS** |
| Task 3: User Registration & Email | `session-4/task-3-registration/index.js` | 4 | 4 | 0 | **PASS** |
| Task 4: Fetch User Profile API | `session-4/task-4-user-profile/index.js` | 6 | 6 | 0 | **PASS** |
| **TOTAL** | | **20** | **20** | **0** | **100% PASS** |
