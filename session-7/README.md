# SESSION 7 — Student Grades Manager

Implementation of **Session 7: Student Grades Manager**, a Node.js file-system application using a local JSON file (`grades.json`) as a persistent data store to manage student grade records without any external database dependencies.

---

## 📁 Exact File Structure

```
session-7/
├── README.md
└── student_grades_manager/
    ├── data/
    │   └── grades.json
    ├── modules/
    │   ├── add.grade.js
    │   ├── delete.grade.js
    │   ├── read.grades.js
    │   ├── update.grade.js
    │   └── save.grades.js
    └── main.js
```

---

## 🎯 Objective & Data Store

### Objective
Build a lightweight, modular CRUD (Create, Read, Update, Delete) application using Node.js built-in `fs` (File System) and `path` modules to read, manipulate, and save student grade records stored in a JSON file.

### JSON Data Store (`data/grades.json`)
The source of stored records is `data/grades.json`. Each grade record contains the three explicitly required fields:
- **`studentName`**: Name of the student
- **`subject`**: Academic subject
- **`grade`**: Numeric score
- (*`id`* is also included for uniquely identifying and deleting records by numeric ID).

Example record:
```json
{
  "id": 1,
  "studentName": "Alice Johnson",
  "subject": "Mathematics",
  "grade": 92
}
```

---

## 🧩 Role of Every Module

| Module | File | Responsibility |
| :--- | :--- | :--- |
| **Module 1** | `modules/add.grade.js` | Validates input (`studentName`, `subject`, `grade`), generates a unique ID, appends the new record to the list, and persists to `grades.json`. |
| **Module 2** | `modules/delete.grade.js` | Locates and deletes a grade record matching either a numeric **ID** or a **Name** (case-insensitive), and updates `grades.json`. |
| **Module 3** | `modules/read.grades.js` | Reads `grades.json` using `fs.readFileSync`, parses JSON, displays formatted records in the terminal, and returns the records array. |
| **Module 4** | `modules/update.grade.js` | Locates an existing student's record by **ID** or **Name**, updates their grade value, and persists changes. |
| **Module 5** | `modules/save.grades.js` | Centralized helper responsible for stringifying and writing JSON data to `data/grades.json` using `fs.writeFileSync`. |
| **Main Entry** | `main.js` | Orchestrates and demonstrates all operations sequentially: Read $\to$ Add $\to$ Read $\to$ Update $\to$ Read $\to$ Delete (by Name and ID) $\to$ Read $\to$ Error handling. |

---

## 🚀 How to Run `main.js`

From the repository root directory, run:

```bash
node session-7/student_grades_manager/main.js
```

---

## 🧪 Operations Tested

When `main.js` is executed, it tests and verifies the complete lifecycle of grade management:

1. **Read Initial Grades**: Displays existing student records loaded from `grades.json`.
2. **Add Grade**: Adds a new record (`"David Miller"`, `"Computer Science"`, `95`).
3. **Confirm Addition**: Reads `grades.json` verifying that David Miller is stored.
4. **Update Grade**: Updates Bob Smith's grade from $78$ to $88$.
5. **Confirm Update**: Reads `grades.json` verifying that Bob's grade reflects $88$.
6. **Delete Grade by Name**: Deletes `"Clara Oswald"` by name.
7. **Confirm Deletion**: Reads `grades.json` verifying Clara's record was removed.
8. **Delete Grade by ID**: Deletes David Miller using his generated numeric ID.
9. **Confirm Final State**: Reads `grades.json` verifying David Miller was removed.
10. **Error Handling**:
    - Attempting to update a non-existent student name reports an error without crashing.
    - Attempting to delete a non-existent student ID reports an error without crashing.

---

## 📊 Summary of Test Results

| Operation | Verification Points | Result |
| :--- | :--- | :---: |
| **Read Grades** | Correctly parses and displays records from `data/grades.json` | **PASS [OK]** |
| **Add Grade** | Validates inputs, assigns next ID, appends to JSON file | **PASS [OK]** |
| **Update Grade** | Finds record by Name/ID, updates grade, persists to JSON | **PASS [OK]** |
| **Delete by Name** | Removes record matching student name, persists changes | **PASS [OK]** |
| **Delete by ID** | Removes record matching numeric ID, persists changes | **PASS [OK]** |
| **Error Resilience** | Handles non-existent update/delete queries gracefully | **PASS [OK]** |
