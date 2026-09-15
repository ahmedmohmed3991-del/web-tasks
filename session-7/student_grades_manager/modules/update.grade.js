/**
 * MODULE 4 — update.grade.js
 * Locates an existing grade record (by ID or student name) and updates its grade,
 * then persists the changes to grades.json
 */

const { saveGrades } = require("./save.grades");
const { readGradesSilently } = require("./add.grade");

/**
 * Updates an existing student's grade
 * @param {string|number} identifier - Student ID or student name to locate
 * @param {number} newGrade - The updated grade score
 * @returns {Object|null} The updated record, or null if not found or invalid
 */
function updateGrade(identifier, newGrade) {
  if (identifier === undefined || identifier === null || String(identifier).trim().length === 0) {
    console.log("[Update Grade] Failed: Identifier (ID or name) is required.");
    return null;
  }

  if (typeof newGrade !== "number" || isNaN(newGrade)) {
    console.log("[Update Grade] Failed: New grade must be a valid number.");
    return null;
  }

  const grades = readGradesSilently();
  const cleanId = String(identifier).trim().toLowerCase();

  // Locate record by ID or by studentName (case-insensitive)
  const index = grades.findIndex(
    (g) => String(g.id).toLowerCase() === cleanId || g.studentName.toLowerCase() === cleanId
  );

  if (index === -1) {
    console.log(`[Update Grade] Error: Record for "${identifier}" not found in grades.json.`);
    return null;
  }

  const oldGrade = grades[index].grade;
  grades[index].grade = newGrade;

  const success = saveGrades(grades);

  if (success) {
    console.log(`[Update Grade] Successfully updated ${grades[index].studentName}'s grade from ${oldGrade} to ${newGrade}.`);
    return grades[index];
  } else {
    console.log("[Update Grade] Error: Failed to save updated record to file.");
    return null;
  }
}

module.exports = updateGrade;
