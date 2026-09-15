/**
 * SESSION 5 — School Management System
 * Main Simulation & Automated Test Suite
 *
 * Demonstrates:
 * 1. Object-Oriented Programming (OOP) in JavaScript:
 *    - Classes & Constructors
 *    - Inheritance (`extends`, `super`)
 *    - Encapsulation with private `#` fields
 *    - Controlled access with Getters and Setters
 *    - Method Overriding & Polymorphism
 * 2. Real-world simulation flow
 * 3. Automated unit and integration test suite
 */

const Person = require("./models/Person");
const Principal = require("./models/Principal");
const Teacher = require("./models/Teacher");
const Student = require("./models/Student");

// ==========================================
// PART 1: SIMULATION WORKFLOW
// ==========================================
function runSimulation() {
  console.log("=================================================");
  console.log("    SCHOOL MANAGEMENT SYSTEM — SIMULATION        ");
  console.log("=================================================\n");

  // 1. Instantiate Principal
  const principal = new Principal("Dr. Charles Xavier", "xavier@school.edu", "PRIN-001");
  console.log(`[Init] Created Principal: ${principal.name}`);

  // 2. Instantiate Teachers
  const mathTeacher = new Teacher("Minerva McGonagall", "minerva@school.edu", "TCH-101", "Mathematics");
  const scienceTeacher = new Teacher("Severus Snape", "snape@school.edu", "TCH-102", "Chemistry");

  // 3. Instantiate Students
  const student1 = new Student("Harry Potter", "harry@student.edu", "STU-501");
  const student2 = new Student("Hermione Granger", "hermione@student.edu", "STU-502");

  // 4. Principal adds Teachers & Students to School Registry
  console.log("\n--- STEP 1: Principal Registers School Members ---");
  principal.addMember(mathTeacher);
  principal.addMember(scienceTeacher);
  principal.addMember(student1);
  principal.addMember(student2);

  // 5. Students enroll in subjects
  console.log("\n--- STEP 2: Students Enroll in Subjects ---");
  student1.enrollSubject("Mathematics");
  student1.enrollSubject("Chemistry");
  student1.viewEnrolledSubjects();

  student2.enrollSubject("Mathematics");
  student2.enrollSubject("Chemistry");
  student2.enrollSubject("Advanced Arithmancy");
  student2.viewEnrolledSubjects();

  // 6. Teachers grade students
  console.log("\n--- STEP 3: Teachers Grade Students ---");
  mathTeacher.gradeStudent("Harry Potter", 88);
  mathTeacher.gradeStudent("Hermione Granger", 99);
  mathTeacher.listGradedStudents();

  scienceTeacher.gradeStudent("Harry Potter", 82);
  scienceTeacher.gradeStudent("Hermione Granger", 100);
  scienceTeacher.listGradedStudents();

  // 7. Principal lists all school members
  console.log("\n--- STEP 4: Principal Lists All School Members ---");
  principal.listMembers();

  // 8. Polymorphism Demonstration
  console.log("\n--- STEP 5: Polymorphism Demonstration ---");
  console.log("Iterating over heterogeneous array of Person objects and calling describeRole():\n");

  const schoolRoster = [principal, mathTeacher, scienceTeacher, student1, student2];

  schoolRoster.forEach((member, index) => {
    console.log(`[Roster Item ${index + 1}] ${member.describeRole()}`);
  });

  console.log("\nNotice: The exact same call 'member.describeRole()' produced distinct role-specific behavior based on the runtime type of each instance.\n");
}

// ==========================================
// PART 2: AUTOMATED TEST SUITE
// ==========================================
function runTests() {
  console.log("=================================================");
  console.log("    SCHOOL MANAGEMENT SYSTEM — TEST SUITE        ");
  console.log("=================================================\n");

  let total = 0;
  let passed = 0;

  function assert(name, condition) {
    total++;
    if (condition) passed++;
    console.log(`[TEST ${total}] ${name} -> ${condition ? "PASS [OK]" : "FAIL [X]"}`);
  }

  function assertThrows(name, fn, expectedErrorMessagePart) {
    total++;
    try {
      fn();
      console.log(`[TEST ${total}] ${name} -> FAIL [X] (Did not throw)`);
    } catch (err) {
      const match = !expectedErrorMessagePart || err.message.includes(expectedErrorMessagePart);
      if (match) passed++;
      console.log(`[TEST ${total}] ${name} -> ${match ? "PASS [OK]" : "FAIL [X]"} (Caught: "${err.message}")`);
    }
  }

  // --- Tests: Person Base Class & Encapsulation ---
  console.log("\n--- Testing Person Base Class & Encapsulation ---");
  const p = new Person("Arthur Dent", "arthur@galaxy.org", "ID-42");
  assert("Person name getter works", p.name === "Arthur Dent");
  assert("Person email getter returns normalized email", p.email === "arthur@galaxy.org");
  assert("Person id getter returns id", p.id === "ID-42");

  p.email = "dent.new@galaxy.org";
  assert("Person email setter updates private field", p.email === "dent.new@galaxy.org");

  p.id = "ID-99";
  assert("Person id setter updates private field", p.id === "ID-99");

  assertThrows("Invalid email format rejected by setter", () => {
    p.email = "not-an-email";
  }, "Invalid email address format");

  assertThrows("Empty ID rejected by setter", () => {
    p.id = "";
  }, "ID cannot be empty");

  assertThrows("Invalid characters in ID rejected", () => {
    p.id = "ID with spaces!";
  }, "contains invalid characters");

  assert("Base describeRole() returns Person format", p.describeRole().startsWith("Person: Arthur Dent"));

  // --- Tests: Principal Class ---
  console.log("\n--- Testing Principal Class ---");
  const head = new Principal("Albus Dumbledore", "albus@hogwarts.edu", "PRIN-1");
  const t1 = new Teacher("Remus Lupin", "lupin@hogwarts.edu", "TCH-201", "Defense");
  const s1 = new Student("Ron Weasley", "ron@hogwarts.edu", "STU-701");

  head.addMember(t1);
  head.addMember(s1);
  assert("Principal adds Teacher and Student", head.getMembers().length === 2);

  assertThrows("Principal rejects non-Person objects", () => {
    head.addMember({ name: "Fake Member", id: "FAKE-1" });
  }, "Only valid Person instances");

  assertThrows("Principal rejects duplicate member IDs", () => {
    const duplicate = new Teacher("Impostor Lupin", "impostor@hogwarts.edu", "TCH-201", "Dark Arts");
    head.addMember(duplicate);
  }, "already registered");

  const removed = head.removeMember("TCH-201");
  assert("Principal removes member by ID", removed.id === "TCH-201" && head.getMembers().length === 1);

  assertThrows("Principal throws on removing non-existent member ID", () => {
    head.removeMember("NON-EXISTENT-ID");
  }, "not found in school registry");

  // --- Tests: Teacher Class ---
  console.log("\n--- Testing Teacher Class ---");
  const teacher = new Teacher("Filius Flitwick", "flitwick@hogwarts.edu", "TCH-301", "Charms");
  assert("Teacher inherits from Person", teacher instanceof Person);
  assert("Teacher has subject property", teacher.subject === "Charms");

  const grade1 = teacher.gradeStudent("Ron Weasley", 85);
  const grade2 = teacher.gradeStudent("Neville Longbottom", 92);
  assert("Teacher records multiple student grades", teacher.getGrades().length === 2);
  assert("Grade record has correct fields", grade1.studentName === "Ron Weasley" && grade1.grade === 85);

  assertThrows("Teacher rejects negative grade", () => {
    teacher.gradeStudent("Malfoy", -10);
  }, "Grade must be a number between 0 and 100");

  assertThrows("Teacher rejects grade > 100", () => {
    teacher.gradeStudent("Malfoy", 105);
  }, "Grade must be a number between 0 and 100");

  assertThrows("Teacher rejects non-numeric grade", () => {
    teacher.gradeStudent("Malfoy", "A+");
  }, "Grade must be a number between 0 and 100");

  // --- Tests: Student Class ---
  console.log("\n--- Testing Student Class ---");
  const student = new Student("Luna Lovegood", "luna@hogwarts.edu", "STU-801");
  assert("Student inherits from Person", student instanceof Person);

  student.enrollSubject("Astronomy");
  student.enrollSubject("Care of Magical Creatures");
  assert("Student enrolls in multiple subjects", student.getEnrolledSubjects().length === 2);

  assertThrows("Student prevents duplicate subject enrollment", () => {
    student.enrollSubject("astronomy"); // case-insensitive check
  }, "already enrolled");

  assertThrows("Student rejects empty subject", () => {
    student.enrollSubject("   ");
  }, "Subject name must be a non-empty string");

  // --- Tests: Polymorphism ---
  console.log("\n--- Testing Polymorphism ---");
  const testList = [
    new Principal("Principal Test", "p@test.com", "P-1"),
    new Teacher("Teacher Test", "t@test.com", "T-1", "Biology"),
    new Student("Student Test", "s@test.com", "S-1")
  ];

  const descriptions = testList.map((m) => m.describeRole());
  assert("Principal describeRole begins with 'Principal:'", descriptions[0].startsWith("Principal:"));
  assert("Teacher describeRole begins with 'Teacher:'", descriptions[1].startsWith("Teacher:"));
  assert("Student describeRole begins with 'Student:'", descriptions[2].startsWith("Student:"));

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log("=================================================\n");
}

if (require.main === module) {
  runSimulation();
  runTests();
}

module.exports = {
  Person,
  Principal,
  Teacher,
  Student,
  runSimulation,
  runTests
};
