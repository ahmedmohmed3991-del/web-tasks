/**
 * Derived Class: Teacher
 *
 * Demonstrates:
 * - Inheritance (`extends Person`)
 * - Domain-specific properties (`subject`)
 * - Encapsulation of grade records in private `#grades` array
 * - Input validation for scores/grades
 * - Method overriding for polymorphism (`describeRole`)
 */

const Person = require("./Person");

class Teacher extends Person {
  // Public domain property
  subject;

  // Private collection of recorded student grades
  #grades = [];

  /**
   * Constructs a Teacher instance
   * @param {string} name
   * @param {string} email
   * @param {string|number} id
   * @param {string} subject - Subject taught by the teacher
   */
  constructor(name, email, id, subject) {
    super(name, email, id);

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      throw new Error("Validation Error: Teacher subject must be a non-empty string.");
    }
    this.subject = subject.trim();
  }

  /**
   * Grades a student and records the result
   * @param {string} studentName - Student's name
   * @param {number} grade - Score between 0 and 100
   * @returns {{ studentName: string, grade: number, subject: string }}
   */
  gradeStudent(studentName, grade) {
    // Validate student name
    if (!studentName || typeof studentName !== "string" || studentName.trim().length === 0) {
      throw new Error("Validation Error: Student name must be a non-empty string.");
    }

    // Validate grade range (0 to 100 numeric)
    if (typeof grade !== "number" || isNaN(grade) || grade < 0 || grade > 100) {
      throw new Error(`Validation Error: Grade must be a number between 0 and 100. Received: '${grade}'.`);
    }

    const cleanStudentName = studentName.trim();
    const gradeRecord = {
      studentName: cleanStudentName,
      grade,
      subject: this.subject,
      recordedAt: new Date().toISOString()
    };

    this.#grades.push(gradeRecord);
    console.log(`[Teacher Action] Graded ${cleanStudentName}: ${grade}/100 in ${this.subject}.`);
    return gradeRecord;
  }

  /**
   * Returns a copy of all recorded student grades
   * @returns {Array<{ studentName: string, grade: number, subject: string }>}
   */
  getGrades() {
    return [...this.#grades];
  }

  /**
   * Displays and returns a formatted list of all graded students
   * @returns {Array<string>}
   */
  listGradedStudents() {
    console.log(`\n--- Gradebook: ${this.name} (${this.subject}) ---`);
    if (this.#grades.length === 0) {
      console.log("  (No student grades recorded yet)");
      return [];
    }

    const formatted = this.#grades.map((rec, i) => {
      const line = `[${i + 1}] Student: ${rec.studentName} | Grade: ${rec.grade}/100 | Subject: ${rec.subject}`;
      console.log(`  ${line}`);
      return line;
    });
    console.log("---------------------------------------------------\n");

    return formatted;
  }

  /**
   * Polymorphic role description override
   * @returns {string}
   */
  describeRole() {
    return `Teacher: ${this.name} - Teaching ${this.subject} with ${this.#grades.length} graded student record(s).`;
  }
}

module.exports = Teacher;
