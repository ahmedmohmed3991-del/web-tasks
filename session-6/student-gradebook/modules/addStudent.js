/**
 * Module: addStudent
 * Adds a student with an array of grades to the students data store
 */

const students = require("../data/students");

/**
 * Adds a student record to the gradebook
 * @param {string} name - Name of the student
 * @param {Array<number>} grades - Array of numeric grades
 * @returns {Object} The added student record
 */
function addStudent(name, grades) {
  if (!name || typeof name !== "string") {
    console.log("[Add Student] Invalid student name.");
    return null;
  }

  const validGrades = Array.isArray(grades) ? [...grades] : [];
  const student = {
    name: name.trim(),
    grades: validGrades
  };

  students.push(student);
  console.log(`[Add Student] Added student "${student.name}" with grades: [${student.grades.join(", ")}].`);
  return student;
}

module.exports = addStudent;
