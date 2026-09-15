# SESSION 6 — Modular Systems: Shopping Cart & Student Gradebook

Implementation of **Session 6**, containing two independent modular JavaScript projects:
1. **Simple Shopping Cart**
2. **Student Gradebook**

---

## 📁 Exact File Structure

```
session-6/
├── README.md
├── shopping-cart/
│   ├── index.js
│   ├── modules/
│   │   ├── addToCart.js
│   │   ├── removeFromCart.js
│   │   ├── listCart.js
│   │   └── calculateTotal.js
│   └── data/
│       ├── products.js
│       └── cart.js
└── student-gradebook/
    ├── index.js
    ├── modules/
    │   ├── addStudent.js
    │   ├── calculateAverage.js
    │   ├── filterPassed.js
    │   └── listStudents.js
    └── data/
        └── students.js
```

---

## 🛒 Project 1 — Simple Shopping Cart

### Purpose
Provides a modular cart system enabling:
- Adding available products by ID to the cart
- Removing items by ID from the cart
- Listing current items in the cart
- Calculating the total monetary price of items in the cart

### File Responsibilities
- `data/products.js`: Contains catalog of available products (`id`, `name`, `price`).
- `data/cart.js`: Stores cart items in an array.
- `modules/addToCart.js`: Finds product by ID in catalog and adds it to the cart.
- `modules/removeFromCart.js`: Removes an item matching the specified ID from the cart.
- `modules/listCart.js`: Logs all current items in the cart to the console.
- `modules/calculateTotal.js`: Sums the prices of all items in the cart.
- `index.js`: Controls the overall flow of shopping cart operations.

### How to Run
```bash
node session-6/shopping-cart/index.js
```

### What Was Tested
- Adding products by ID (Wireless Headphones, Gaming Mouse, USB-C Hub).
- Listing cart items to the console.
- Calculating initial cart total ($174.98).
- Removing an item by ID (Gaming Mouse).
- Listing updated cart contents (2 items remaining).
- Calculating updated total price ($129.98).

---

## 📚 Project 2 — Student Gradebook

### Purpose
Provides a system to manage students and their academic grades, enabling:
- Adding students with an array of numeric grades
- Calculating individual student averages
- Listing all students with their grades, averages, and pass/fail statuses
- Filtering and displaying students who passed based on the explicitly specified threshold:
  $$\text{average} \ge 60$$

### File Responsibilities
- `data/students.js`: Holds student records (`name`, `grades` array).
- `modules/addStudent.js`: Adds a new student record to the data store.
- `modules/calculateAverage.js`: Computes the arithmetic mean of an array of grades.
- `modules/filterPassed.js`: Filters students with an average $\ge 60$.
- `modules/listStudents.js`: Logs all student records with grades, calculated averages, and statuses.
- `index.js`: Main control file executing student additions, listing, average calculations, and pass evaluation.

### How to Run
```bash
node session-6/student-gradebook/index.js
```

### What Was Tested
- Adding students with varying arrays of grades.
- Calculating individual student averages (e.g. Alice: 86.25, Bob: 58.75, Emma: 96.25).
- Boundary check: student with exact average of 60.00 (Frank Wright) correctly identified as passed.
- Filter check: student with average < 60 (Bob Smith: 58.75) excluded from passed list.
- Listing all records and displaying the filtered passed list.

---

## 📊 Summary of Test Results

| Project | Command | Verification Points | Result |
| :--- | :--- | :--- | :---: |
| **Shopping Cart** | `node session-6/shopping-cart/index.js` | Add products, remove item, list items, calculate totals ($174.98 $\to$ $129.98) | **PASS [OK]** |
| **Student Gradebook** | `node session-6/student-gradebook/index.js` | Add students, calculate averages, list students, filter passed ($\ge 60$) | **PASS [OK]** |
