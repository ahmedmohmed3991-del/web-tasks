/**
 * Module: listStudents
 * Lists all students with their grades and calculated averages
 */

const students = require("../data/students");
const calculateAverage = require("./calculateAverage");

/**
 * Logs and returns a list of all students currently in the gradebook
 * @returns {Array<Object>} List of student objects with calculated averages
 */
function listStudents() {
  console.log("\n--- Student Gradebook Records ---");

  if (students.length === 0) {
    console.log("  No student records found.");
    console.log("---------------------------------\n");
    return [];
  }

  const detailedList = students.map((student, index) => {
    const avg = calculateAverage(student.grades);
    const status = avg >= 60 ? "PASSED" : "FAILED";
    console.log(`  [${index + 1}] ${student.name} | Grades: [${student.grades.join(", ")}] | Average: ${avg.toFixed(2)} | Status: ${status}`);
    return {
      ...student,
      average: avg,
      status
    };
  });

  console.log("---------------------------------\n");
  return detailedList;
}

module.exports = listStudents;
