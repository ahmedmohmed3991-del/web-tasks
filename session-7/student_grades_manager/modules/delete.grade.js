/**
 * MODULE 2 — delete.grade.js
 * Deletes a student's grade record by ID OR Name, and updates grades.json
 */

const { saveGrades } = require("./save.grades");
const { readGradesSilently } = require("./add.grade");

/**
 * Deletes a student grade record matching either an ID or student name
 * @param {string|number} identifier - Student ID or student name
 * @returns {Object|null} The deleted record, or null if not found
 */
function deleteGrade(identifier) {
  if (identifier === undefined || identifier === null || String(identifier).trim().length === 0) {
    console.log("[Delete Grade] Failed: Identifier (ID or name) is required.");
    return null;
  }

  const grades = readGradesSilently();
  const cleanId = String(identifier).trim().toLowerCase();

  // Locate record by ID or by studentName (case-insensitive)
  const index = grades.findIndex(
    (g) => String(g.id).toLowerCase() === cleanId || g.studentName.toLowerCase() === cleanId
  );

  if (index === -1) {
    console.log(`[Delete Grade] Error: Record for "${identifier}" not found in grades.json.`);
    return null;
  }

  const removedRecord = grades.splice(index, 1)[0];
  const success = saveGrades(grades);

  if (success) {
    console.log(`[Delete Grade] Successfully deleted record for "${removedRecord.studentName}" (ID: ${removedRecord.id}).`);
    return removedRecord;
  } else {
    console.log("[Delete Grade] Error: Failed to update grades.json file.");
    return null;
  }
}

module.exports = deleteGrade;
