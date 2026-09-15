/**
 * CHALLENGE 1 — ATM Banking System
 *
 * Simulates an ATM banking console application with PIN verification,
 * balance inquiries, cash withdrawals, deposits, PIN changes, and
 * an account lockout security policy after 3 consecutive failed attempts.
 */

class ATM {
  /**
   * Initialize ATM state
   * @param {string} initialPin - 4-digit PIN
   * @param {number} initialBalance - Initial bank balance
   */
  constructor(initialPin = "1234", initialBalance = 1000) {
    this.userPin = initialPin;
    this.currentBalance = initialBalance;
    this.selectedOperation = null;
    this.transactionAmount = 0;
    this.failedAttempts = 0;
    this.isLocked = false;
    this.maxAttempts = 3;
  }

  /**
   * Internal PIN authentication helper
   * @param {string} enteredPin
   * @returns {boolean}
   */
  #authenticate(enteredPin) {
    if (this.isLocked) {
      return false;
    }

    if (enteredPin === this.userPin) {
      this.failedAttempts = 0; // Reset consecutive failed attempts on success
      return true;
    } else {
      this.failedAttempts++;
      if (this.failedAttempts >= this.maxAttempts) {
        this.isLocked = true;
      }
      return false;
    }
  }

  /**
   * Check current balance
   * @param {string} enteredPin
   * @returns {{ success: boolean, message: string, balance?: number }}
   */
  checkBalance(enteredPin) {
    this.selectedOperation = "CHECK_BALANCE";
    this.transactionAmount = 0;

    if (this.isLocked) {
      return {
        success: false,
        message: "Account locked due to 3 consecutive incorrect PIN attempts. Contact customer support."
      };
    }

    if (!this.#authenticate(enteredPin)) {
      const remaining = this.maxAttempts - this.failedAttempts;
      return {
        success: false,
        message: this.isLocked
          ? "Incorrect PIN. Account is now LOCKED due to 3 failed attempts."
          : `Incorrect PIN. ${remaining} attempt(s) remaining.`
      };
    }

    return {
      success: true,
      message: `Your current balance is $${this.currentBalance.toFixed(2)}.`,
      balance: this.currentBalance
    };
  }

  /**
   * Deposit money into account
   * @param {string} enteredPin
   * @param {number} amount
   * @returns {{ success: boolean, message: string, newBalance?: number }}
   */
  deposit(enteredPin, amount) {
    this.selectedOperation = "DEPOSIT";
    this.transactionAmount = amount;

    if (this.isLocked) {
      return {
        success: false,
        message: "Account is locked. Operation prohibited."
      };
    }

    if (!this.#authenticate(enteredPin)) {
      const remaining = this.maxAttempts - this.failedAttempts;
      return {
        success: false,
        message: this.isLocked
          ? "Incorrect PIN. Account is now LOCKED."
          : `Incorrect PIN. ${remaining} attempt(s) remaining.`
      };
    }

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return {
        success: false,
        message: "Deposit amount must be a valid positive number greater than zero."
      };
    }

    this.currentBalance += amount;
    return {
      success: true,
      message: `Successfully deposited $${amount.toFixed(2)}. New balance: $${this.currentBalance.toFixed(2)}.`,
      newBalance: this.currentBalance
    };
  }

  /**
   * Withdraw money from account
   * @param {string} enteredPin
   * @param {number} amount
   * @returns {{ success: boolean, message: string, newBalance?: number }}
   */
  withdraw(enteredPin, amount) {
    this.selectedOperation = "WITHDRAW";
    this.transactionAmount = amount;

    if (this.isLocked) {
      return {
        success: false,
        message: "Account is locked. Operation prohibited."
      };
    }

    if (!this.#authenticate(enteredPin)) {
      const remaining = this.maxAttempts - this.failedAttempts;
      return {
        success: false,
        message: this.isLocked
          ? "Incorrect PIN. Account is now LOCKED."
          : `Incorrect PIN. ${remaining} attempt(s) remaining.`
      };
    }

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return {
        success: false,
        message: "Withdrawal amount must be a positive number greater than zero."
      };
    }

    if (amount > this.currentBalance) {
      return {
        success: false,
        message: `Insufficient funds. Requested $${amount.toFixed(2)}, but available balance is $${this.currentBalance.toFixed(2)}.`
      };
    }

    this.currentBalance -= amount;
    return {
      success: true,
      message: `Successfully withdrew $${amount.toFixed(2)}. New balance: $${this.currentBalance.toFixed(2)}.`,
      newBalance: this.currentBalance
    };
  }

  /**
   * Change ATM PIN
   * @param {string} enteredPin
   * @param {string} newPin
   * @returns {{ success: boolean, message: string }}
   */
  changePin(enteredPin, newPin) {
    this.selectedOperation = "CHANGE_PIN";
    this.transactionAmount = 0;

    if (this.isLocked) {
      return {
        success: false,
        message: "Account is locked. Operation prohibited."
      };
    }

    if (!this.#authenticate(enteredPin)) {
      const remaining = this.maxAttempts - this.failedAttempts;
      return {
        success: false,
        message: this.isLocked
          ? "Incorrect PIN. Account is now LOCKED."
          : `Incorrect PIN. ${remaining} attempt(s) remaining.`
      };
    }

    // New PIN must be exactly 4 digits
    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(String(newPin))) {
      return {
        success: false,
        message: "PIN change failed. New PIN must contain exactly four numeric digits."
      };
    }

    if (newPin === this.userPin) {
      return {
        success: false,
        message: "New PIN cannot be identical to your current PIN."
      };
    }

    this.userPin = String(newPin);
    return {
      success: true,
      message: "PIN successfully updated. Please use your new PIN for future transactions."
    };
  }
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runAtmTests() {
  console.log("=================================================");
  console.log("    ATM BANKING SYSTEM — AUTOMATED TEST SUITE    ");
  console.log("=================================================\n");

  let passedCount = 0;
  let totalTests = 0;

  function assertTest(testName, expectedSuccess, actualResult, customCheck = true) {
    totalTests++;
    const isSuccessMatch = actualResult.success === expectedSuccess;
    const passed = isSuccessMatch && customCheck;
    if (passed) passedCount++;

    console.log(`[TEST ${totalTests}] ${testName}`);
    console.log(`  - Expected Success: ${expectedSuccess}`);
    console.log(`  - Actual Success  : ${actualResult.success}`);
    console.log(`  - System Message  : ${actualResult.message}`);
    console.log(`  - Result          : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
  }

  // Scenario 1: Initial balance verification
  const atm1 = new ATM("1234", 1500);
  const res1 = atm1.checkBalance("1234");
  assertTest(
    "Check balance with correct PIN",
    true,
    res1,
    res1.balance === 1500
  );

  // Scenario 2: Valid deposit
  const res2 = atm1.deposit("1234", 500);
  assertTest(
    "Deposit positive amount ($500)",
    true,
    res2,
    res2.newBalance === 2000
  );

  // Scenario 3: Invalid deposit (zero or negative)
  const res3 = atm1.deposit("1234", 0);
  assertTest(
    "Deposit invalid zero amount ($0)",
    false,
    res3
  );

  const res3b = atm1.deposit("1234", -100);
  assertTest(
    "Deposit invalid negative amount (-$100)",
    false,
    res3b
  );

  // Scenario 4: Valid withdrawal
  const res4 = atm1.withdraw("1234", 800);
  assertTest(
    "Withdraw valid amount ($800) within balance",
    true,
    res4,
    res4.newBalance === 1200
  );

  // Scenario 5: Overdraft withdrawal (exceeding balance)
  const res5 = atm1.withdraw("1234", 5000);
  assertTest(
    "Withdraw amount exceeding balance ($5000 from $1200)",
    false,
    res5
  );

  // Scenario 6: Invalid withdrawal (negative amount)
  const res6 = atm1.withdraw("1234", -50);
  assertTest(
    "Withdraw negative amount (-$50)",
    false,
    res6
  );

  // Scenario 7: PIN change - Invalid length/format
  const res7 = atm1.changePin("1234", "12a4");
  assertTest(
    "Change PIN with non-digit characters ('12a4')",
    false,
    res7
  );

  const res7b = atm1.changePin("1234", "12345");
  assertTest(
    "Change PIN with 5 digits instead of 4 ('12345')",
    false,
    res7b
  );

  // Scenario 8: PIN change - Valid new PIN
  const res8 = atm1.changePin("1234", "9876");
  assertTest(
    "Change PIN with valid 4-digit PIN ('9876')",
    true,
    res8
  );

  // Scenario 9: Verify old PIN no longer works and new PIN works
  const res9Old = atm1.checkBalance("1234");
  assertTest(
    "Check balance using old PIN ('1234') after PIN change",
    false,
    res9Old
  );

  const res9New = atm1.checkBalance("9876");
  assertTest(
    "Check balance using new PIN ('9876')",
    true,
    res9New
  );

  // Scenario 10: Bonus - Account lockout after 3 consecutive failed PIN attempts
  const atm2 = new ATM("4321", 500);
  const fail1 = atm2.checkBalance("0000"); // Attempt 1
  assertTest("Failed PIN attempt 1 of 3", false, fail1, !atm2.isLocked);

  const fail2 = atm2.withdraw("0000", 100); // Attempt 2
  assertTest("Failed PIN attempt 2 of 3", false, fail2, !atm2.isLocked);

  const fail3 = atm2.deposit("0000", 200); // Attempt 3 (triggers lock)
  assertTest("Failed PIN attempt 3 of 3 (Lock Trigger)", false, fail3, atm2.isLocked === true);

  // Scenario 11: Attempt operation on locked account even with correct PIN
  const lockedOp = atm2.checkBalance("4321");
  assertTest(
    "Subsequent operation with CORRECT PIN on LOCKED account is blocked",
    false,
    lockedOp,
    atm2.isLocked === true
  );

  console.log("=================================================");
  console.log(`TOTAL ATM TESTS: ${totalTests} | PASSED: ${passedCount} | FAILED: ${totalTests - passedCount}`);
  console.log("=================================================\n");
}

// Run test suite when executed directly
if (require.main === module) {
  runAtmTests();
}

module.exports = ATM;
