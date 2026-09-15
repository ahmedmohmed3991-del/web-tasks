/**
 * CHALLENGE 3 — University Student Portal
 *
 * Implements a university grading and evaluation portal with attendance policy enforcement,
 * financial clearance gates (tuition status), weighted score calculation, letter grade assignment,
 * academic standing assessment, and merit scholarship qualification (Bonus).
 */

// ==========================================
// CONFIGURATION & ACADEMIC STANDARDS
// ==========================================
const ACADEMIC_CONFIG = {
  MIN_ATTENDANCE_PERCENT: 75.0, // Minimum attendance to avoid automatic failure
  WEIGHTS: {
    MIDTERM: 0.30,   // 30% of total grade
    FINAL_EXAM: 0.50, // 50% of total grade
    ASSIGNMENT: 0.20 // 20% of total grade
  },
  SCHOLARSHIP_THRESHOLDS: {
    PRESIDENTIAL: { minScore: 92.0, minAttendance: 90.0, name: "Presidential Merit Scholarship (100% Tuition Waiver)" },
    DEANS_LIST:   { minScore: 85.0, minAttendance: 85.0, name: "Dean's Excellence Award (50% Tuition Waiver)" }
  }
};

class StudentPortal {
  /**
   * Evaluate student performance and generate academic report
   * @param {Object} record
   * @param {string} record.studentName
   * @param {number} record.attendancePercentage (0 - 100)
   * @param {number} record.midtermScore (0 - 100)
   * @param {number} record.finalExamScore (0 - 100)
   * @param {number} record.assignmentScore (0 - 100)
   * @param {string|boolean} record.tuitionPaymentStatus - "PAID" or "UNPAID" / boolean
   * @returns {Object} Evaluation report
   */
  static evaluateStudent({
    studentName,
    attendancePercentage,
    midtermScore,
    finalExamScore,
    assignmentScore,
    tuitionPaymentStatus
  }) {
    // Input validation
    if (!studentName || typeof studentName !== "string") {
      throw new Error("Invalid student name.");
    }
    const scores = [
      { name: "Attendance", val: attendancePercentage },
      { name: "Midterm", val: midtermScore },
      { name: "Final Exam", val: finalExamScore },
      { name: "Assignment", val: assignmentScore }
    ];
    for (const item of scores) {
      if (typeof item.val !== "number" || isNaN(item.val) || item.val < 0 || item.val > 100) {
        throw new Error(`${item.name} percentage/score must be a valid number between 0 and 100.`);
      }
    }

    const isTuitionPaid = (
      tuitionPaymentStatus === true ||
      String(tuitionPaymentStatus).toUpperCase().trim() === "PAID"
    );

    // Business Rule 1: Unpaid tuition blocks result access
    if (!isTuitionPaid) {
      return {
        accessGranted: false,
        studentName,
        tuitionStatus: "UNPAID",
        message: "ACCESS DENIED: Tuition payment is pending. Results are locked until financial clearance is obtained."
      };
    }

    // Calculate weighted total score
    const weightedTotal = Math.round(
      ((midtermScore * ACADEMIC_CONFIG.WEIGHTS.MIDTERM) +
       (finalExamScore * ACADEMIC_CONFIG.WEIGHTS.FINAL_EXAM) +
       (assignmentScore * ACADEMIC_CONFIG.WEIGHTS.ASSIGNMENT)) * 100
    ) / 100;

    // Business Rule 2: Attendance check (< 75% results in automatic failure)
    const attendancePassed = attendancePercentage >= ACADEMIC_CONFIG.MIN_ATTENDANCE_PERCENT;

    let letterGrade = "";
    let academicStatus = "";
    let scholarship = "Not Eligible";

    if (!attendancePassed) {
      letterGrade = "F";
      academicStatus = "FAILED — ATTENDANCE BREACH (< 75%)";
      scholarship = "Not Eligible (Attendance below requirement)";
    } else {
      // Determine Letter Grade & Academic Status
      if (weightedTotal >= 90) {
        letterGrade = "A";
        academicStatus = "HONORS / EXCELLENT STANDING";
      } else if (weightedTotal >= 80) {
        letterGrade = "B";
        academicStatus = "GOOD STANDING";
      } else if (weightedTotal >= 70) {
        letterGrade = "C";
        academicStatus = "SATISFACTORY STANDING";
      } else if (weightedTotal >= 60) {
        letterGrade = "D";
        academicStatus = "ACADEMIC WARNING";
      } else {
        letterGrade = "F";
        academicStatus = "FAILED — ACADEMIC DEFICIENCY";
      }

      // Bonus: Scholarship Evaluation
      if (
        weightedTotal >= ACADEMIC_CONFIG.SCHOLARSHIP_THRESHOLDS.PRESIDENTIAL.minScore &&
        attendancePercentage >= ACADEMIC_CONFIG.SCHOLARSHIP_THRESHOLDS.PRESIDENTIAL.minAttendance
      ) {
        scholarship = ACADEMIC_CONFIG.SCHOLARSHIP_THRESHOLDS.PRESIDENTIAL.name;
      } else if (
        weightedTotal >= ACADEMIC_CONFIG.SCHOLARSHIP_THRESHOLDS.DEANS_LIST.minScore &&
        attendancePercentage >= ACADEMIC_CONFIG.SCHOLARSHIP_THRESHOLDS.DEANS_LIST.minAttendance
      ) {
        scholarship = ACADEMIC_CONFIG.SCHOLARSHIP_THRESHOLDS.DEANS_LIST.name;
      }
    }

    return {
      accessGranted: true,
      studentName,
      tuitionStatus: "PAID",
      attendancePercentage,
      attendancePassed,
      scores: {
        midterm: midtermScore,
        finalExam: finalExamScore,
        assignment: assignmentScore
      },
      totalScore: weightedTotal,
      letterGrade,
      academicStatus,
      scholarshipEligibility: scholarship
    };
  }

  /**
   * Format student transcript report card
   * @param {Object} report
   * @returns {string}
   */
  static formatReportCard(report) {
    if (!report.accessGranted) {
      return [
        "============================================================",
        "              UNIVERSITY STUDENT PORTAL: NOTICE             ",
        "============================================================",
        `Student Name   : ${report.studentName}`,
        `Tuition Status : ${report.tuitionStatus}`,
        `Notice         : ${report.message}`,
        "============================================================"
      ].join("\n");
    }

    return [
      "============================================================",
      "             UNIVERSITY OFFICIAL ACADEMIC REPORT            ",
      "============================================================",
      `Student Name            : ${report.studentName}`,
      `Tuition Status          : ${report.tuitionStatus} [CLEARED]`,
      `Attendance Rate         : ${report.attendancePercentage}% ${report.attendancePassed ? "[MEETS REQUIREMENT]" : "[FAILED ATTENDANCE MINIMUM]"}`,
      "------------------------------------------------------------",
      "COURSEWORK BREAKDOWN:",
      `  • Midterm Exam (30%)   : ${report.scores.midterm.toFixed(1)} / 100`,
      `  • Final Exam   (50%)   : ${report.scores.finalExam.toFixed(1)} / 100`,
      `  • Assignments  (20%)   : ${report.scores.assignment.toFixed(1)} / 100`,
      "------------------------------------------------------------",
      `TOTAL WEIGHTED SCORE    : ${report.totalScore.toFixed(2)}%`,
      `FINAL LETTER GRADE      : ${report.letterGrade}`,
      `ACADEMIC STATUS         : ${report.academicStatus}`,
      "------------------------------------------------------------",
      `SCHOLARSHIP STATUS      : ${report.scholarshipEligibility}`,
      "============================================================"
    ].join("\n");
  }
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runPortalTests() {
  console.log("=================================================");
  console.log("    UNIVERSITY STUDENT PORTAL — TEST SUITE       ");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedCount = 0;

  function assertPortal(testName, input, validator) {
    totalTests++;
    try {
      const result = StudentPortal.evaluateStudent(input);
      const passed = validator(result);
      if (passed) passedCount++;

      console.log(`[TEST ${totalTests}] ${testName}`);
      console.log(`  - Access Granted : ${result.accessGranted}`);
      if (result.accessGranted) {
        console.log(`  - Total Score    : ${result.totalScore}%`);
        console.log(`  - Letter Grade   : ${result.letterGrade}`);
        console.log(`  - Academic Status: ${result.academicStatus}`);
        console.log(`  - Scholarship    : ${result.scholarshipEligibility}`);
      } else {
        console.log(`  - Notice         : ${result.message}`);
      }
      console.log(`  - Result         : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
    } catch (err) {
      const passed = validator(err);
      if (passed) passedCount++;
      console.log(`[TEST ${totalTests}] ${testName}`);
      console.log(`  - Caught Expected Error: "${err.message}"`);
      console.log(`  - Result               : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
    }
  }

  // Test 1: Presidential Merit Scholarship (Outstanding)
  // Midterm: 95, Final: 96, Assignment: 90 => Total: (28.5 + 48 + 18) = 94.5%
  // Attendance: 95% >= 90% => Grade A, Presidential Scholarship
  assertPortal(
    "Outstanding Student qualifies for Presidential Merit Scholarship",
    {
      studentName: "Hermione Granger",
      attendancePercentage: 98,
      midtermScore: 95,
      finalExamScore: 96,
      assignmentScore: 90,
      tuitionPaymentStatus: "PAID"
    },
    res => res.accessGranted === true &&
           res.totalScore === 94.5 &&
           res.letterGrade === "A" &&
           res.scholarshipEligibility.includes("Presidential Merit Scholarship")
  );

  // Test 2: Dean's Excellence Award
  // Midterm: 85, Final: 88, Assignment: 90 => Total: (25.5 + 44 + 18) = 87.5%
  // Attendance: 88% => Grade B, Dean's Award
  assertPortal(
    "Honor Student qualifies for Dean's Excellence Award",
    {
      studentName: "Harry Potter",
      attendancePercentage: 88,
      midtermScore: 85,
      finalExamScore: 88,
      assignmentScore: 90,
      tuitionPaymentStatus: "PAID"
    },
    res => res.accessGranted === true &&
           res.totalScore === 87.5 &&
           res.letterGrade === "B" &&
           res.scholarshipEligibility.includes("Dean's Excellence Award")
  );

  // Test 3: Average student in Good Standing (no scholarship)
  // Midterm: 75, Final: 80, Assignment: 70 => Total: (22.5 + 40 + 14) = 76.5%
  assertPortal(
    "Satisfactory Student in Good/Satisfactory Standing",
    {
      studentName: "Ron Weasley",
      attendancePercentage: 80,
      midtermScore: 75,
      finalExamScore: 80,
      assignmentScore: 70,
      tuitionPaymentStatus: "PAID"
    },
    res => res.accessGranted === true &&
           res.totalScore === 76.5 &&
           res.letterGrade === "C" &&
           res.scholarshipEligibility === "Not Eligible"
  );

  // Test 4: Automatic failure due to low attendance (< 75%)
  // Even with high scores (95 midterm, 95 final), attendance is 60%
  assertPortal(
    "High exam scores but Low Attendance (< 75%) causes Automatic Failure",
    {
      studentName: "Draco Malfoy",
      attendancePercentage: 65,
      midtermScore: 95,
      finalExamScore: 95,
      assignmentScore: 95,
      tuitionPaymentStatus: "PAID"
    },
    res => res.accessGranted === true &&
           res.letterGrade === "F" &&
           res.attendancePassed === false &&
           res.academicStatus.includes("ATTENDANCE BREACH")
  );

  // Test 5: Unpaid tuition blocks viewing results
  assertPortal(
    "Unpaid tuition restricts access to grades and status",
    {
      studentName: "Neville Longbottom",
      attendancePercentage: 90,
      midtermScore: 85,
      finalExamScore: 80,
      assignmentScore: 85,
      tuitionPaymentStatus: "UNPAID"
    },
    res => res.accessGranted === false &&
           res.message.includes("ACCESS DENIED")
  );

  // Test 6: Attendance Boundary Check (exactly 75%)
  assertPortal(
    "Exact Attendance Boundary (75.0%) meets minimum attendance requirement",
    {
      studentName: "Luna Lovegood",
      attendancePercentage: 75.0,
      midtermScore: 80,
      finalExamScore: 80,
      assignmentScore: 80,
      tuitionPaymentStatus: "PAID"
    },
    res => res.accessGranted === true &&
           res.attendancePassed === true &&
           res.letterGrade === "B"
  );

  // Test 7: Input Validation - Negative Score throws descriptive error
  assertPortal(
    "Input validation: Negative score throws error",
    {
      studentName: "Tom Riddle",
      attendancePercentage: 90,
      midtermScore: -10,
      finalExamScore: 80,
      assignmentScore: 80,
      tuitionPaymentStatus: "PAID"
    },
    err => err instanceof Error && err.message.includes("must be a valid number between 0 and 100")
  );

  // Test 8: Input Validation - Score over 100 throws error
  assertPortal(
    "Input validation: Score > 100 throws error",
    {
      studentName: "Tom Riddle",
      attendancePercentage: 90,
      midtermScore: 105,
      finalExamScore: 80,
      assignmentScore: 80,
      tuitionPaymentStatus: "PAID"
    },
    err => err instanceof Error && err.message.includes("must be a valid number between 0 and 100")
  );

  console.log("=================================================");
  console.log(`TOTAL PORTAL TESTS: ${totalTests} | PASSED: ${passedCount} | FAILED: ${totalTests - passedCount}`);
  console.log("=================================================\n");

  // Demonstration Report Cards
  console.log("DEMONSTRATION 1: Cleared Student Academic Report");
  const clearedReport = StudentPortal.evaluateStudent({
    studentName: "Hermione Granger",
    attendancePercentage: 98,
    midtermScore: 95,
    finalExamScore: 96,
    assignmentScore: 90,
    tuitionPaymentStatus: "PAID"
  });
  console.log(StudentPortal.formatReportCard(clearedReport));

  console.log("\nDEMONSTRATION 2: Financial Hold Notice");
  const holdNotice = StudentPortal.evaluateStudent({
    studentName: "Neville Longbottom",
    attendancePercentage: 90,
    midtermScore: 85,
    finalExamScore: 80,
    assignmentScore: 85,
    tuitionPaymentStatus: "UNPAID"
  });
  console.log(StudentPortal.formatReportCard(holdNotice));
}

if (require.main === module) {
  runPortalTests();
}

module.exports = StudentPortal;
