/**
 * MODULE 3 — read.grades.js
 * Reads records from grades.json and displays all student grades
 */

const fs = require("fs");
const { DATA_FILE_PATH, saveGrades } = require("./save.grades");

/**
 * Reads all student grade records from grades.json and logs them to the console
 * @returns {Array<Object>} Array of grade records
 */
function readGrades() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      // If file doesn't exist yet, initialize it as empty array
      saveGrades([]);
      console.log("\n--- Student Grades Records ---");
      console.log("  No grades found. File initialized as empty.");
      console.log("------------------------------\n");
      return [];
    }

    const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    const grades = JSON.parse(fileContent || "[]");

    console.log("\n--- Current Student Grades Records ---");
    if (grades.length === 0) {
      console.log("  No student grade records currently stored.");
    } else {
      grades.forEach((rec, index) => {
        console.log(`  [${index + 1}] ID: ${rec.id} | Student: ${rec.studentName} | Subject: ${rec.subject} | Grade: ${rec.grade}`);
      });
    }
    console.log("--------------------------------------\n");

    return grades;
  } catch (error) {
    console.error(`[Read Error] Failed to read grades from file: ${error.message}`);
    return [];
  }
}

module.exports = readGrades;
