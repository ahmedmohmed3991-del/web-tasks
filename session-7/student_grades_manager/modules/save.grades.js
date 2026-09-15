/**
 * MODULE 5 — save.grades.js
 * Centralized helper responsible for writing grade data to data/grades.json
 */

const fs = require("fs");
const path = require("path");

const DATA_FILE_PATH = path.join(__dirname, "../data/grades.json");

/**
 * Writes an array of student grade records to grades.json
 * @param {Array<Object>} grades - Array of student grade records
 * @returns {boolean} True if write succeeded, false otherwise
 */
function saveGrades(grades) {
  try {
    // Ensure parent directory exists
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const jsonData = JSON.stringify(grades, null, 2);
    fs.writeFileSync(DATA_FILE_PATH, jsonData, "utf-8");
    return true;
  } catch (error) {
    console.error(`[Save Error] Failed to write grades to file: ${error.message}`);
    return false;
  }
}

module.exports = {
  saveGrades,
  DATA_FILE_PATH
};
