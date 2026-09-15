/**
 * Project 2: Student Gradebook
 * Main Control File: index.js
 *
 * Coordinates calls to:
 * - addStudent: Adding students with arrays of grades
 * - listStudents: Listing all students
 * - calculateAverage: Computing individual and group averages
 * - filterPassed: Showing students who passed with average >= 60
 */

const addStudent = require("./modules/addStudent");
const calculateAverage = require("./modules/calculateAverage");
const filterPassed = require("./modules/filterPassed");
const listStudents = require("./modules/listStudents");
const students = require("./data/students");

function runStudentGradebookApp() {
  console.log("=================================================");
  console.log("     PROJECT 2: STUDENT GRADEBOOK SYSTEM         ");
  console.log("=================================================\n");

  // 1. Add students with grades
  console.log("--- 1. Adding Students with Grades ---");
  addStudent("Alice Johnson", [85, 90, 78, 92]); // Avg: 86.25 (Pass)
  addStudent("Bob Smith", [55, 60, 58, 62]);      // Avg: 58.75 (Fail)
  addStudent("Clara Oswald", [72, 68, 75, 80]);   // Avg: 73.75 (Pass)
  addStudent("David Miller", [45, 50, 40, 55]);   // Avg: 47.50 (Fail)
  addStudent("Emma Watson", [95, 98, 92, 100]);   // Avg: 96.25 (Pass)
  addStudent("Frank Wright", [60, 60, 60, 60]);   // Avg: 60.00 (Pass - Boundary case)

  // 2. List all students
  console.log("\n--- 2. Listing All Students ---");
  const allStudents = listStudents();

  // 3. Calculate and display individual averages
  console.log("--- 3. Individual Student Averages ---");
  allStudents.forEach((s) => {
    const avg = calculateAverage(s.grades);
    console.log(`  ${s.name}: Average = ${avg.toFixed(2)}`);
  });

  // 4. Show students who passed (average >= 60)
  console.log("\n--- 4. Students Who Passed (Average >= 60) ---");
  const passedStudents = filterPassed();

  if (passedStudents.length === 0) {
    console.log("  No students passed the threshold.");
  } else {
    passedStudents.forEach((s, idx) => {
      console.log(`  ${idx + 1}. ${s.name} - Average: ${s.average.toFixed(2)} (>= 60)`);
    });
  }

  // 5. Verification checks
  console.log("\n--- Verification Summary ---");
  const totalCountCorrect = students.length === 6;
  const passedCountCorrect = passedStudents.length === 4; // Alice, Clara, Emma, Frank
  const frankPassedBoundary = passedStudents.some((s) => s.name === "Frank Wright" && s.average === 60);
  const bobExcluded = !passedStudents.some((s) => s.name === "Bob Smith");

  console.log(`Total Students Added (6): ${totalCountCorrect ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Passing Students Count (4): ${passedCountCorrect ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Boundary >= 60 Passed (Frank 60.00): ${frankPassedBoundary ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Below 60 Filtered Out (Bob 58.75): ${bobExcluded ? "PASS [OK]" : "FAIL [X]"}`);

  console.log("\n=================================================");
  console.log("     STUDENT GRADEBOOK OPERATIONS COMPLETED      ");
  console.log("=================================================\n");

  return {
    totalStudents: students.length,
    passedStudentsCount: passedStudents.length,
    passedStudents
  };
}

if (require.main === module) {
  runStudentGradebookApp();
}

module.exports = runStudentGradebookApp;
