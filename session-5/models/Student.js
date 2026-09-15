/**
 * Derived Class: Student
 *
 * Demonstrates:
 * - Inheritance (`extends Person`)
 * - Encapsulation of subject enrollment in private `#enrolledSubjects` array
 * - Duplicate enrollment prevention
 * - Method overriding for polymorphism (`describeRole`)
 */

const Person = require("./Person");

class Student extends Person {
  // Private collection of enrolled subjects
  #enrolledSubjects = [];

  /**
   * Constructs a Student instance
   * @param {string} name
   * @param {string} email
   * @param {string|number} id
   */
  constructor(name, email, id) {
    super(name, email, id);
  }

  /**
   * Enrolls the student into a new subject
   * @param {string} subject - Name of subject to enroll in
   * @returns {string} Enrolled subject name
   */
  enrollSubject(subject) {
    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      throw new Error("Validation Error: Subject name must be a non-empty string.");
    }

    const cleanSubject = subject.trim();
    // Prevent duplicate enrollment (case-insensitive check)
    const alreadyEnrolled = this.#enrolledSubjects.some(
      (s) => s.toLowerCase() === cleanSubject.toLowerCase()
    );

    if (alreadyEnrolled) {
      throw new Error(`Enrollment Error: Student ${this.name} is already enrolled in '${cleanSubject}'.`);
    }

    this.#enrolledSubjects.push(cleanSubject);
    console.log(`[Student Action] ${this.name} successfully enrolled in ${cleanSubject}.`);
    return cleanSubject;
  }

  /**
   * Returns a shallow copy of all enrolled subjects
   * @returns {Array<string>}
   */
  getEnrolledSubjects() {
    return [...this.#enrolledSubjects];
  }

  /**
   * Displays and returns a formatted list of enrolled subjects
   * @returns {string}
   */
  viewEnrolledSubjects() {
    if (this.#enrolledSubjects.length === 0) {
      const emptyMsg = `${this.name} is not currently enrolled in any subjects.`;
      console.log(`[Student View] ${emptyMsg}`);
      return emptyMsg;
    }
    const listMsg = `${this.name}'s Enrolled Subjects: ${this.#enrolledSubjects.join(", ")}`;
    console.log(`[Student View] ${listMsg}`);
    return listMsg;
  }

  /**
   * Polymorphic role description override
   * @returns {string}
   */
  describeRole() {
    const subjectsSummary =
      this.#enrolledSubjects.length > 0
        ? this.#enrolledSubjects.join(", ")
        : "None";
    return `Student: ${this.name} - Enrolled in ${this.#enrolledSubjects.length} subject(s): [${subjectsSummary}].`;
  }
}

module.exports = Student;
