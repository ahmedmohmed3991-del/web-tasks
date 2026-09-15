# SESSION 5 — Object-Oriented School Management System

A comprehensive, clean implementation of an **Object-Oriented School Management System** built with modern JavaScript (ES6+ classes). This project demonstrates the core pillars of Object-Oriented Programming (OOP): **Encapsulation**, **Inheritance**, and **Polymorphism**, along with input validation and private field accessors.

---

## 📁 Project Structure

```
session-5/
├── README.md
├── models/
│   ├── Person.js      # Base class with private fields and getters/setters
│   ├── Principal.js   # Subclass managing school members
│   ├── Teacher.js     # Subclass managing subjects and student gradebooks
│   └── Student.js     # Subclass managing subject enrollments
└── index.js           # Simulation flow and automated test suite
```

---

## 🚀 How to Run

The application is completely self-contained and requires only Node.js (no external dependencies):

```bash
node session-5/index.js
```

Running `node session-5/index.js` executes both the complete step-by-step school simulation and the 28-point automated test suite.

---

## 🏛️ Class Hierarchy & Architecture

```
                    +-----------------------------+
                    |           Person            |
                    |-----------------------------|
                    | + name                      |
                    | - #email                    |
                    | - #id                       |
                    |-----------------------------|
                    | + get/set email             |
                    | + get/set id                |
                    | + describeRole()            |
                    +-----------------------------+
                                   ▲
                                   │ extends
            ┌──────────────────────┼──────────────────────┐
            │                      │                      │
+-----------------------+ +--------------------+ +---------------------+
|       Principal       | |      Teacher       | |       Student       |
|-----------------------| |--------------------| |---------------------|
| - #members: Person[]  | | + subject          | | - #enrolledSubjects |
|-----------------------| | - #grades: Object[]| |---------------------|
| + addMember()         | |--------------------| | + enrollSubject()   |
| + removeMember()      | | + gradeStudent()   | | + viewSubjects()    |
| + listMembers()       | | + listGraded()     | | + describeRole()    |
| + describeRole()      | | + describeRole()   | +---------------------+
+-----------------------+ +--------------------+
```

---

## 💡 Core OOP Concepts Explained

### 1. Encapsulation & Private Fields (`#`)
**Encapsulation** bundles data (state) and methods (behavior) inside an object, hiding internal details from outside interference.

In modern JavaScript, prefixing a field with `#` makes it truly private. Direct access from outside the class (e.g. `person.#email`) throws a syntax error:
```javascript
class Person {
  #email; // Private field

  get email() {
    return this.#email;
  }

  set email(value) {
    if (!isValidEmail(value)) throw new Error("Invalid email format");
    this.#email = value;
  }
}
```
Access is strictly managed through **Getters** and **Setters**, allowing validation rules to guard private state.

---

### 2. Inheritance (`extends` and `super`)
**Inheritance** allows child classes to inherit properties and methods from a parent class, promoting code reuse and establishing an *is-a* relationship (`Teacher` is a `Person`, `Student` is a `Person`):

```javascript
class Teacher extends Person {
  constructor(name, email, id, subject) {
    super(name, email, id); // Invokes the Person parent constructor
    this.subject = subject;
  }
}
```

---

### 3. Polymorphism & Method Overriding
**Polymorphism** ("many forms") allows different classes to respond to the same method call with their own specialized behavior.

The base `Person` class defines a generic `describeRole()`:
```javascript
describeRole() {
  return `Person: ${this.name}`;
}
```
Each derived class **overrides** `describeRole()` to return role-specific information:
- `Principal`: `"Principal: Dr. Xavier - Executive Head of School overseeing 4 registered member(s)."`
- `Teacher`: `"Teacher: Minerva McGonagall - Teaching Mathematics with 2 graded student record(s)."`
- `Student`: `"Student: Harry Potter - Enrolled in 2 subject(s): [Mathematics, Chemistry]."`

When iterating through a collection of `Person` objects, calling `member.describeRole()` executes the child class's customized version automatically at runtime without needing `if/else` type checking.

---

### 4. Input Validation & Data Integrity
All setters and modifying methods enforce business rules:
- **Email Validation**: Rejects malformed email strings using regex.
- **ID Validation**: Ensures ID is non-empty and contains only valid alphanumeric/hyphen characters.
- **Member Addition**: Verifies that new members are instances of `Person` and prevents duplicate IDs.
- **Grade Assignment**: Requires numeric scores strictly between $0$ and $100$.
- **Subject Enrollment**: Prevents students from enrolling in duplicate subjects (case-insensitive).

---

## 📋 Class Responsibilities

| Class | Extends | Core Responsibilities |
| :--- | :--- | :--- |
| **`Person`** | Base | Stores public `name`, private `#email`, and `#id`. Validates accessors. Provides default `describeRole()`. |
| **`Principal`** | `Person` | Manages school registry `#members`. Adds members with type/duplicate checking, removes members, lists roster, overrides `describeRole()`. |
| **`Teacher`** | `Person` | Manages `subject` and private `#grades` gradebook. Grades students with score validation ($0-100$), lists grades, overrides `describeRole()`. |
| **`Student`** | `Person` | Manages `#enrolledSubjects`. Enrolls in subjects with duplicate detection, views subjects, overrides `describeRole()`. |

---

## 🖥️ Example Simulation Output

```text
=================================================
    SCHOOL MANAGEMENT SYSTEM — SIMULATION        
=================================================

[Init] Created Principal: Dr. Charles Xavier

--- STEP 1: Principal Registers School Members ---
[Principal Action] Registered new member: Minerva McGonagall (Teacher) with ID TCH-101
[Principal Action] Registered new member: Severus Snape (Teacher) with ID TCH-102
[Principal Action] Registered new member: Harry Potter (Student) with ID STU-501
[Principal Action] Registered new member: Hermione Granger (Student) with ID STU-502

--- STEP 2: Students Enroll in Subjects ---
[Student Action] Harry Potter successfully enrolled in Mathematics.
[Student Action] Harry Potter successfully enrolled in Chemistry.
[Student View] Harry Potter's Enrolled Subjects: Mathematics, Chemistry
[Student Action] Hermione Granger successfully enrolled in Mathematics.
[Student Action] Hermione Granger successfully enrolled in Chemistry.
[Student Action] Hermione Granger successfully enrolled in Advanced Arithmancy.

--- STEP 3: Teachers Grade Students ---
[Teacher Action] Graded Harry Potter: 88/100 in Mathematics.
[Teacher Action] Graded Hermione Granger: 99/100 in Mathematics.
[Teacher Action] Graded Harry Potter: 82/100 in Chemistry.
[Teacher Action] Graded Hermione Granger: 100/100 in Chemistry.

--- STEP 4: Principal Lists All School Members ---
--- School Registry (Managed by Principal Dr. Charles Xavier) ---
  [1] Teacher: Minerva McGonagall | ID: TCH-101 | Email: minerva@school.edu
  [2] Teacher: Severus Snape | ID: TCH-102 | Email: snape@school.edu
  [3] Student: Harry Potter | ID: STU-501 | Email: harry@student.edu
  [4] Student: Hermione Granger | ID: STU-502 | Email: hermione@student.edu

--- STEP 5: Polymorphism Demonstration ---
[Roster Item 1] Principal: Dr. Charles Xavier - Executive Head of School overseeing 4 registered member(s).
[Roster Item 2] Teacher: Minerva McGonagall - Teaching Mathematics with 2 graded student record(s).
[Roster Item 3] Teacher: Severus Snape - Teaching Chemistry with 2 graded student record(s).
[Roster Item 4] Student: Harry Potter - Enrolled in 2 subject(s): [Mathematics, Chemistry].
[Roster Item 5] Student: Hermione Granger - Enrolled in 3 subject(s): [Mathematics, Chemistry, Advanced Arithmancy].
```

---

## 📊 Summary of Test Results

| Component Tested | Test Cases Verified | Passed | Failed |
| :--- | :--- | :---: | :---: |
| **`Person` Base Class** | Name getter, email getter/setter, ID getter/setter, invalid email rejection, invalid ID rejection, base `describeRole()` | 9 | 0 |
| **`Principal` Class** | Add teacher/student, reject non-Person objects, reject duplicate IDs, remove member, missing ID removal error | 5 | 0 |
| **`Teacher` Class** | Inheritance check, subject property, grade recording, negative grade rejection, > 100 rejection, string grade rejection | 7 | 0 |
| **`Student` Class** | Inheritance check, multiple subject enrollment, duplicate enrollment prevention, empty subject rejection | 4 | 0 |
| **Polymorphism** | Array iteration calling overridden `describeRole()` across Principal, Teacher, Student | 3 | 0 |
| **TOTAL** | | **28** | **0** |
