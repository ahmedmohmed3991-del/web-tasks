/**
 * MAIN.JS — Student Grades Manager Entry Point
 *
 * Demonstrates the required sequence of operations:
 * 1. Read grades
 * 2. Add a grade
 * 3. Read grades
 * 4. Update a grade
 * 5. Read grades
 * 6. Delete a grade (demonstrates delete by Name and by ID)
 * 7. Read grades
 * 8. Error handling verification (updating/deleting non-existent records)
 */

const readGrades = require("./modules/read.grades");
const { addGrade } = require("./modules/add.grade");
const updateGrade = require("./modules/update.grade");
const deleteGrade = require("./modules/delete.grade");

function runStudentGradesManager() {
  console.log("=================================================");
  console.log("    SESSION 7: STUDENT GRADES MANAGER DEMO       ");
  console.log("=================================================\n");

  // Step 1: Read initial grades
  console.log(">>> STEP 1: READ INITIAL GRADES <<<");
  const initialGrades = readGrades();

  // Step 2: Add a new grade
  console.log(">>> STEP 2: ADD A NEW GRADE <<<");
  const addedStudent = addGrade("David Miller", "Computer Science", 95);

  // Step 3: Read grades (verify addition)
  console.log(">>> STEP 3: READ GRADES (CONFIRM ADDITION) <<<");
  const gradesAfterAdd = readGrades();

  // Step 4: Update an existing student's grade
  console.log(">>> STEP 4: UPDATE A STUDENT'S GRADE <<<");
  console.log("Updating Bob Smith's grade from 78 to 88...");
  const updatedStudent = updateGrade("Bob Smith", 88);

  // Step 5: Read grades (verify update)
  console.log(">>> STEP 5: READ GRADES (CONFIRM UPDATE) <<<");
  const gradesAfterUpdate = readGrades();

  // Step 6: Delete a grade (Delete by ID or Name)
  console.log(">>> STEP 6: DELETE A GRADE (BY NAME) <<<");
  console.log("Deleting Clara Oswald's grade record...");
  const deletedByName = deleteGrade("Clara Oswald");

  // Step 7: Read grades (verify deletion)
  console.log(">>> STEP 7: READ GRADES (CONFIRM DELETION) <<<");
  const gradesAfterDelete = readGrades();

  // Additional verification: Delete by ID
  console.log(">>> BONUS DEMO: DELETE A GRADE (BY ID) <<<");
  console.log(`Deleting newly added student by ID (${addedStudent?.id})...`);
  const deletedById = deleteGrade(addedStudent?.id);

  console.log(">>> FINAL READ GRADES <<<");
  const finalGrades = readGrades();

  // Error handling demonstrations
  console.log(">>> STEP 8: ERROR HANDLING DEMONSTRATION <<<");
  console.log("1. Attempting to update a non-existent student ('NonExistentStudent'):");
  const failedUpdate = updateGrade("NonExistentStudent", 90);

  console.log("2. Attempting to delete a non-existent student ID (9999):");
  const failedDelete = deleteGrade(9999);

  // Automated assertion checks
  console.log("\n=================================================");
  console.log("              VERIFICATION SUMMARY               ");
  console.log("=================================================");

  const passAdd = addedStudent !== null && gradesAfterAdd.some((g) => g.studentName === "David Miller");
  const passUpdate = updatedStudent !== null && updatedStudent.grade === 88;
  const passDeleteName = deletedByName !== null && !gradesAfterDelete.some((g) => g.studentName === "Clara Oswald");
  const passDeleteId = deletedById !== null && !finalGrades.some((g) => g.id === addedStudent?.id);
  const passErrorHandling = failedUpdate === null && failedDelete === null;

  console.log(`Add Grade Operation              : ${passAdd ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Update Grade Operation           : ${passUpdate ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Delete by Name Operation         : ${passDeleteName ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Delete by ID Operation           : ${passDeleteId ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Error Handling (Non-existent IDs): ${passErrorHandling ? "PASS [OK]" : "FAIL [X]"}`);

  console.log("=================================================\n");

  return {
    passAdd,
    passUpdate,
    passDeleteName,
    passDeleteId,
    passErrorHandling
  };
}

if (require.main === module) {
  runStudentGradesManager();
}

module.exports = runStudentGradesManager;
