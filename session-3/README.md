# SESSION 3 — JavaScript Runtime, Asynchronous Programming & Callbacks

Comprehensive implementation of **Session 3: JavaScript Practice Tasks**, exploring:
1. **Synchronous Execution**: Call stack mechanics, top-to-bottom sequencing, and functional dependencies.
2. **Asynchronous Basics (`setTimeout`)**: Non-blocking timers, delayed processing, and interval sequences.
3. **JavaScript Runtime & The Event Loop**: Mechanics of the Call Stack, Web/Node APIs, Task/Callback Queue (Macrotasks), zero-delay timeouts (`setTimeout(fn, 0)`), and stack starvation/blocking.
4. **Callback Functions**: Higher-order functions, operation injection (custom calculators), asynchronous data loaders, and branching authentication control flows.

---

## 📁 Project Structure

```
session-3/
├── README.md
├── synchronous/
│   └── index.js
├── asynchronous/
│   └── index.js
├── event-loop/
│   └── index.js
└── callbacks/
    └── index.js
```

---

## 🚀 How to Run Each Section

All files are completely independent and run using standard Node.js:

```bash
# 1. Synchronous Execution
node session-3/synchronous/index.js

# 2. Asynchronous Basics (setTimeout)
node session-3/asynchronous/index.js

# 3. JavaScript Runtime & Event Loop
node session-3/event-loop/index.js

# 4. Callback Functions
node session-3/callbacks/index.js
```

---

## 1 — Synchronous Execution (`synchronous/index.js`)

### Objective
Demonstrate that JavaScript is a single-threaded language executing code synchronously by default. Instructions are pushed onto the Call Stack, evaluated, and popped off one by one in exact order.

### Exercises
- **Exercise 1 (Order of Execution)**: Logs `"Start"`, `"Middle"`, `"End"` sequentially, proving strict line-by-line progression.
- **Exercise 2 (Nested Call Stack)**: `parentFunction()` calls `childFunction()`. Demonstrates that the parent function halts execution and awaits child completion before resuming and exiting.
- **Exercise 3 (Sequential Calculations)**: Pipeline computing $15 + 25 = 40 \to 40 \times 2.5 = 100 \to 100 - 18 = 82$, where each operation strictly depends on the previous synchronous result.
- **Exercise 4 (Dependent Function Flow)**: `generateReceipt()` sequentially coordinates `calculateSubtotal()`, `calculateTax()`, and receipt assembly.

### Expected Output
```text
Start
Middle
End
[Parent] Entered parentFunction
[Parent] Calling childFunction...
  -> [Child] Entered childFunction
  -> [Child] Performing child operation
  -> [Child] Exiting childFunction
[Parent] Resumed parentFunction after child finished
[Parent] Exiting parentFunction
```

---

## 2 — Asynchronous Basics — setTimeout (`asynchronous/index.js`)

### Objective
Demonstrate non-blocking concurrency using `setTimeout()`. JavaScript delegates timer countdowns to the Node.js C++ runtime or browser Web APIs, leaving the main thread unblocked.

### Exercises
- **Exercise 1 ("Hello" immediately, "World" after 2s)**: Shows immediate synchronous execution followed by delayed asynchronous completion.
- **Exercise 2 (Sequential 1-to-5 Countdown)**: Sequentially prints numbers 1 through 5, each after a 1000ms delay.
- **Exercise 3 ("Loading..." immediately, "Done" after 3s)**: Simulates an application loading state indicator.
- **Exercise 4 (Delayed Message Delivery System)**: Dispatches a message with custom delay metadata, recording queuing timestamps, arrival confirmations, and actual latency.

### Expected Output
```text
Hello
World (delivered after ~2.01s)
Starting 1-to-5 countdown (1 second delay between each):
  [Timer] Number: 1 (at +1s)
  [Timer] Number: 2 (at +2s)
  [Timer] Number: 3 (at +3s)
  [Timer] Number: 4 (at +4s)
  [Timer] Number: 5 (at +5s)
Loading...
Done (completed in ~3.00s)
```

---

## 3 — JavaScript Runtime & Event Loop (`event-loop/index.js`)

### Objective
Examine the interaction between the **Call Stack**, **Node Runtime / Web APIs**, **Callback Queue (Macrotasks)**, and the **Event Loop**.

```
+-------------------------------------------------------------+
|                        CALL STACK                           |
|  console.log()  <-- Currently executing synchronous frame   |
+-------------------------------------------------------------+
                              |
               Is Call Stack empty? (NO -> Wait)
                              |
+-------------------------------------------------------------+
|                        EVENT LOOP                           |
|  Continuously monitors the Call Stack and Callback Queue     |
+-------------------------------------------------------------+
                              ^
            When Call Stack is EMPTY, move 1 callback
                              |
+-------------------------------------------------------------+
|                 CALLBACK QUEUE (Macrotasks)                 |
|  [ setTimeout callback 1, setTimeout callback 2, ... ]      |
+-------------------------------------------------------------+
```

### Exercises & Observations
- **Exercise 1 (Standard Event Loop Order)**:
  - *Expected Order*: `"1: Synchronous start"` $\to$ `"3: Synchronous end"` $\to$ `"2: Asynchronous timeout callback (50ms)"`.
  - *Observation*: The asynchronous callback never interrupts synchronous execution on the stack.
- **Exercise 2 (`setTimeout(..., 0)` Priority)**:
  - *Why synchronous messages run before `setTimeout(fn, 0)`*: Even with a 0ms delay, calling `setTimeout` hands the callback to the runtime, which places it into the Callback Queue. The Event Loop **strictly refuses** to push queued tasks onto the Call Stack until the Call Stack has completely cleared of all synchronous code.
- **Exercise 3 (Line-by-Line Synchronous Priority)**:
  - Demonstrates that synchronous math, transformations, and logging finish completely before queued timers execute.
- **Exercise 4 (Call Stack Starvation / Blocking)**:
  - Schedules a 10ms timer and immediately enters an 80ms synchronous blocking loop.
  - *Observation*: The timer callback is forced to wait ~80ms despite its 10ms parameter, proving that asynchronous execution cannot preempt a busy Call Stack.

---

## 4 — Callback Functions (`callbacks/index.js`)

### Objective
Practice using callbacks as synchronous first-class functions and asynchronous event handlers.

### Exercises
- **Exercise 1 (Greeting Callback)**: `greetUser(name, callback)` accepts a name and an action callback.
- **Exercise 2 (Calculator Callback)**: `calculate(a, b, operationCallback)` accepts operation functions (`add`, `subtract`, `multiply`).
- **Exercise 3 (Data Loading Callback)**: `loadUserData(userId, callback)` simulates database retrieval with a Node.js standard `(err, data)` error-first callback convention.
- **Exercise 4 (Authentication Flow)**: `authenticate(credentials, onSuccess, onFailure)` controls authentication branching:
  $$\text{login} \longrightarrow \begin{cases} \text{onSuccess} \to \text{Session Created} \to \text{Load User Dashboard} \\ \text{onFailure} \to \text{Access Denied} \to \text{Redirect to Recovery} \end{cases}$$

---

## 📊 Summary of Test Results

| Section | Script Path | Tests Executed | Passed | Failed | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| 1. Synchronous Execution | `session-3/synchronous/index.js` | 4 | 4 | 0 | **PASS** |
| 2. Asynchronous Basics | `session-3/asynchronous/index.js` | 4 | 4 | 0 | **PASS** |
| 3. Runtime & Event Loop | `session-3/event-loop/index.js` | 4 | 4 | 0 | **PASS** |
| 4. Callback Functions | `session-3/callbacks/index.js` | 6 | 6 | 0 | **PASS** |
| **TOTAL** | | **18** | **18** | **0** | **100% PASS** |
