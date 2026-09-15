/**
 * Module: filterPassed
 * Filters students with average >= 60
 */

const students = require("../data/students");
const calculateAverage = require("./calculateAverage");

const PASSING_THRESHOLD = 60; // Explicitly required threshold: average >= 60

/**
 * Filters and returns students who achieved an average of 60 or higher
 * @returns {Array<Object>} List of passing students with their averages
 */
function filterPassed() {
  const passingStudents = [];

  students.forEach((student) => {
    const avg = calculateAverage(student.grades);
    if (avg >= PASSING_THRESHOLD) {
      passingStudents.push({
        ...student,
        average: avg
      });
    }
  });

  return passingStudents;
}

module.exports = filterPassed;
