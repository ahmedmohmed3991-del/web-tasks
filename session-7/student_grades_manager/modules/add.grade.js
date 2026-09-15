/**
 * MODULE 1 — add.grade.js
 * Adds a new grade record containing student name, subject, and grade,
 * and saves it to grades.json
 */

const readGrades = require("./read.grades");
const { saveGrades } = require("./save.grades");

/**
 * Adds a new student grade record to grades.json
 * @param {string} studentName - Student name
 * @param {string} subject - Subject name
 * @param {number} grade - Grade score
 * @returns {Object|null} The created record, or null on validation failure
 */
function addGrade(studentName, subject, grade) {
  if (!studentName || typeof studentName !== "string" || studentName.trim().length === 0) {
    console.log("[Add Grade] Failed: Student name is required.");
    return null;
  }
  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    console.log("[Add Grade] Failed: Subject is required.");
    return null;
  }
  if (typeof grade !== "number" || isNaN(grade)) {
    console.log("[Add Grade] Failed: Grade must be a valid number.");
    return null;
  }

  // Load existing records quietly
  const grades = readGradesSilently();

  // Generate unique numeric ID
  const nextId = grades.length > 0 ? Math.max(...grades.map((g) => Number(g.id) || 0)) + 1 : 1;

  const newRecord = {
    id: nextId,
    studentName: studentName.trim(),
    subject: subject.trim(),
    grade
  };

  grades.push(newRecord);
  const success = saveGrades(grades);

  if (success) {
    console.log(`[Add Grade] Successfully added record for "${newRecord.studentName}" (Subject: ${newRecord.subject}, Grade: ${newRecord.grade}, ID: ${newRecord.id}).`);
    return newRecord;
  } else {
    console.log("[Add Grade] Error: Failed to persist record to grades.json.");
    return null;
  }
}

/**
 * Internal helper to read records without logging
 */
function readGradesSilently() {
  const fs = require("fs");
  const { DATA_FILE_PATH } = require("./save.grades");
  if (!fs.existsSync(DATA_FILE_PATH)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

module.exports = {
  addGrade,
  readGradesSilently
};
