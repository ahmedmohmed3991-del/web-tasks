/**
 * CHALLENGE 2 — E-Commerce Checkout System
 *
 * Implements an e-commerce checkout processor with tiered category discounts,
 * promotional coupons, payment method incentives, negative price protection (Bonus),
 * VAT taxation, and detailed printable invoice generation.
 */

// ==========================================
// CONFIGURATION & BUSINESS DISCOUNT RULES
// ==========================================
const CATEGORY_DISCOUNTS = {
  ELECTRONICS: 0.10, // 10% discount
  CLOTHING: 0.15,    // 15% discount
  BOOKS: 0.05,       // 5% discount
  GROCERIES: 0.02,   // 2% discount
  HOME: 0.08         // 8% discount
};

const COUPON_CODES = {
  SAVE10: { type: "PERCENT", value: 0.10, description: "10% Off Promo" },
  SUPER20: { type: "PERCENT", value: 0.20, description: "20% Super Saver" },
  MEGA50: { type: "PERCENT", value: 0.50, description: "50% Mega Flash Sale" },
  FLAT100: { type: "FLAT", value: 100.00, description: "$100 Flat Voucher" },
  VIPFREE: { type: "PERCENT", value: 1.50, description: "150% Super Voucher (Tests $0 Clamp)" }
};

const PAYMENT_DISCOUNTS = {
  LOYALTY_POINTS: 0.05, // 5% discount
  DEBIT_CARD: 0.03,     // 3% discount
  CRYPTO: 0.02,         // 2% discount
  CREDIT_CARD: 0.00,    // 0% discount
  CASH: 0.00            // 0% discount
};

const VAT_RATE = 0.14; // 14% Value Added Tax

class CheckoutSystem {
  /**
   * Process customer checkout order
   * @param {Object} order
   * @param {string} order.customerName
   * @param {string} order.productCategory
   * @param {number} order.productPrice
   * @param {number} order.quantity
   * @param {string} [order.couponCode]
   * @param {string} order.paymentMethod
   * @returns {Object} Calculated invoice breakdown
   */
  static processOrder({
    customerName,
    productCategory,
    productPrice,
    quantity,
    couponCode = "",
    paymentMethod = "CASH"
  }) {
    // Basic Input Validations
    if (!customerName || typeof customerName !== "string") {
      throw new Error("Invalid Customer Name.");
    }
    if (typeof productPrice !== "number" || productPrice <= 0 || isNaN(productPrice)) {
      throw new Error("Product Price must be a positive number.");
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer.");
    }

    const normCategory = (productCategory || "").toUpperCase().trim();
    const normPayment = (paymentMethod || "").toUpperCase().trim();
    const normCoupon = (couponCode || "").toUpperCase().trim();

    // Helper to round currency to 2 decimal places
    const roundCurrency = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

    // 1. Calculate Subtotal
    const subtotal = roundCurrency(productPrice * quantity);

    // 2. Category Discount
    const categoryDiscountRate = CATEGORY_DISCOUNTS[normCategory] || 0.0;
    const categoryDiscountAmount = roundCurrency(subtotal * categoryDiscountRate);

    // 3. Coupon Discount
    let couponDiscountAmount = 0;
    let couponApplied = null;
    if (normCoupon && COUPON_CODES[normCoupon]) {
      const coupon = COUPON_CODES[normCoupon];
      couponApplied = { code: normCoupon, ...coupon };
      if (coupon.type === "PERCENT") {
        couponDiscountAmount = roundCurrency(subtotal * coupon.value);
      } else if (coupon.type === "FLAT") {
        couponDiscountAmount = roundCurrency(coupon.value);
      }
    }

    // 4. Payment Method Discount
    const paymentDiscountRate = PAYMENT_DISCOUNTS[normPayment] || 0.0;
    const paymentDiscountAmount = roundCurrency(subtotal * paymentDiscountRate);

    // 5. Total Discount Calculation & Negative Price Protection (Bonus)
    const rawTotalDiscount = roundCurrency(categoryDiscountAmount + couponDiscountAmount + paymentDiscountAmount);
    
    // Net price after discount: clamped at 0 if discounts exceed subtotal
    const netTaxableAmount = Math.max(0, roundCurrency(subtotal - rawTotalDiscount));
    const effectiveTotalDiscount = roundCurrency(subtotal - netTaxableAmount);

    // 6. VAT Calculation (calculated on net taxable amount)
    const vatAmount = roundCurrency(netTaxableAmount * VAT_RATE);

    // 7. Grand Total
    const grandTotal = roundCurrency(netTaxableAmount + vatAmount);

    return {
      customerName,
      productCategory: normCategory,
      productPrice,
      quantity,
      couponCode: couponApplied ? couponApplied.code : (normCoupon ? `${normCoupon} (INVALID)` : "NONE"),
      paymentMethod: normPayment,
      subtotal,
      discounts: {
        categoryRate: categoryDiscountRate,
        categoryAmount: categoryDiscountAmount,
        couponRate: couponApplied?.type === "PERCENT" ? couponApplied.value : null,
        couponAmount: couponDiscountAmount,
        couponDetails: couponApplied,
        paymentRate: paymentDiscountRate,
        paymentAmount: paymentDiscountAmount,
        rawTotalDiscount,
        effectiveTotalDiscount
      },
      netTaxableAmount,
      isPriceClampedToZero: (subtotal - rawTotalDiscount) < 0,
      vatRate: VAT_RATE,
      vatAmount,
      grandTotal
    };
  }

  /**
   * Format and display invoice breakdown to console
   * @param {Object} invoice
   * @returns {string} Formatted invoice text
   */
  static generateInvoice(invoice) {
    const lines = [
      "============================================================",
      "                   OFFICIAL PURCHASE INVOICE                ",
      "============================================================",
      `Customer Name       : ${invoice.customerName}`,
      `Product Category    : ${invoice.productCategory}`,
      `Payment Method      : ${invoice.paymentMethod}`,
      `Coupon Code         : ${invoice.couponCode}`,
      "------------------------------------------------------------",
      `Unit Price          : $${invoice.productPrice.toFixed(2)}`,
      `Quantity            : ${invoice.quantity}`,
      `Subtotal            : $${invoice.subtotal.toFixed(2)}`,
      "------------------------------------------------------------",
      "APPLIED DISCOUNTS:",
      `  • Category (${(invoice.discounts.categoryRate * 100).toFixed(0)}%)     : -$${invoice.discounts.categoryAmount.toFixed(2)}`,
      `  • Coupon Discount     : -$${invoice.discounts.couponAmount.toFixed(2)} ${invoice.discounts.couponDetails ? `[${invoice.discounts.couponDetails.description}]` : ""}`,
      `  • Payment Method (${(invoice.discounts.paymentRate * 100).toFixed(0)}%): -$${invoice.discounts.paymentAmount.toFixed(2)}`,
      `Total Deductions    : -$${invoice.discounts.effectiveTotalDiscount.toFixed(2)}`,
      invoice.isPriceClampedToZero ? "  * Price clamped to $0.00 (Discounts exceeded subtotal) *" : "",
      "------------------------------------------------------------",
      `Net Taxable Amount  : $${invoice.netTaxableAmount.toFixed(2)}`,
      `VAT (${(invoice.vatRate * 100).toFixed(0)}%)           : +$${invoice.vatAmount.toFixed(2)}`,
      "============================================================",
      `FINAL PAYABLE TOTAL : $${invoice.grandTotal.toFixed(2)}`,
      "============================================================"
    ].filter(line => line !== "");

    const formattedInvoice = lines.join("\n");
    return formattedInvoice;
  }
}

// ==========================================
// TEST SUITE & DEMONSTRATION RUNNER
// ==========================================
function runCheckoutTests() {
  console.log("=================================================");
  console.log("   E-COMMERCE CHECKOUT SYSTEM — TEST SUITE       ");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedCount = 0;

  function assertCheckout(testName, order, validator) {
    totalTests++;
    try {
      const invoice = CheckoutSystem.processOrder(order);
      const passed = validator(invoice);
      if (passed) passedCount++;

      console.log(`[TEST ${totalTests}] ${testName}`);
      console.log(`  - Subtotal       : $${invoice.subtotal.toFixed(2)}`);
      console.log(`  - Total Discount : $${invoice.discounts.effectiveTotalDiscount.toFixed(2)}`);
      console.log(`  - VAT (${(invoice.vatRate * 100).toFixed(0)}%)       : $${invoice.vatAmount.toFixed(2)}`);
      console.log(`  - Grand Total    : $${invoice.grandTotal.toFixed(2)}`);
      console.log(`  - Result         : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
    } catch (err) {
      const passed = validator(err);
      if (passed) passedCount++;
      console.log(`[TEST ${totalTests}] ${testName}`);
      console.log(`  - Caught Expected Error: "${err.message}"`);
      console.log(`  - Result               : ${passed ? "PASS [OK]" : "FAIL [X]"}\n`);
    }
  }

  // Test 1: Standard Electronics purchase with Loyalty Points and SAVE10
  // Price: 1000, Qty: 2 => Subtotal: 2000
  // Electronics: 10% = 200
  // SAVE10: 10% = 200
  // Loyalty Points: 5% = 100
  // Total discounts = 500, Net = 1500
  // VAT 14% on 1500 = 210
  // Grand Total = 1710
  assertCheckout(
    "Standard Electronics Order with stacked discounts",
    {
      customerName: "Alice Smith",
      productCategory: "ELECTRONICS",
      productPrice: 1000,
      quantity: 2,
      couponCode: "SAVE10",
      paymentMethod: "LOYALTY_POINTS"
    },
    inv => inv.subtotal === 2000 &&
           inv.discounts.categoryAmount === 200 &&
           inv.discounts.couponAmount === 200 &&
           inv.discounts.paymentAmount === 100 &&
           inv.netTaxableAmount === 1500 &&
           inv.vatAmount === 210 &&
           inv.grandTotal === 1710
  );

  // Test 2: Clothing order with invalid coupon and Debit Card
  // Price: 100, Qty: 3 => Subtotal: 300
  // Clothing: 15% = 45
  // Invalid coupon: 0
  // Debit card: 3% = 9
  // Total discounts = 54, Net = 246
  // VAT: 246 * 0.14 = 34.44
  // Grand Total: 280.44
  assertCheckout(
    "Clothing Order with invalid coupon and Debit Card",
    {
      customerName: "Bob Johnson",
      productCategory: "CLOTHING",
      productPrice: 100,
      quantity: 3,
      couponCode: "EXPIRED99",
      paymentMethod: "DEBIT_CARD"
    },
    inv => inv.subtotal === 300 &&
           inv.discounts.categoryAmount === 45 &&
           inv.discounts.couponAmount === 0 &&
           inv.discounts.paymentAmount === 9 &&
           Math.abs(inv.vatAmount - 34.44) < 0.001 &&
           Math.abs(inv.grandTotal - 280.44) < 0.001
  );

  // Test 3: Flat voucher discount
  // Price: 50, Qty: 4 => Subtotal: 200
  // Books: 5% = 10
  // FLAT100: 100
  // Cash: 0% = 0
  // Total discounts = 110, Net = 90
  // VAT: 90 * 0.14 = 12.60
  // Grand Total: 102.60
  assertCheckout(
    "Books Order with FLAT100 voucher",
    {
      customerName: "Clara Oswald",
      productCategory: "BOOKS",
      productPrice: 50,
      quantity: 4,
      couponCode: "FLAT100",
      paymentMethod: "CASH"
    },
    inv => inv.subtotal === 200 &&
           inv.discounts.couponAmount === 100 &&
           inv.netTaxableAmount === 90 &&
           Math.abs(inv.grandTotal - 102.60) < 0.001
  );

  // Test 4: BONUS FEATURE — Discount exceeds subtotal (Clamp to 0)
  // Price: 30, Qty: 1 => Subtotal: 30
  // FLAT100 gives $100 off => 30 - 100 = -$70, clamped to 0
  // VAT on 0 = 0, Grand Total = 0
  assertCheckout(
    "BONUS: Negative price protection clamps to $0.00",
    {
      customerName: "David Miller",
      productCategory: "GROCERIES",
      productPrice: 30,
      quantity: 1,
      couponCode: "FLAT100",
      paymentMethod: "CASH"
    },
    inv => inv.subtotal === 30 &&
           inv.netTaxableAmount === 0 &&
           inv.isPriceClampedToZero === true &&
           inv.vatAmount === 0 &&
           inv.grandTotal === 0
  );

  // Test 5: Validation error for negative price
  assertCheckout(
    "Invalid product price (< 0) throws descriptive error",
    {
      customerName: "Eva Green",
      productCategory: "ELECTRONICS",
      productPrice: -50,
      quantity: 1
    },
    err => err instanceof Error && err.message.includes("Product Price must be a positive number")
  );

  // Test 6: Validation error for non-positive quantity
  assertCheckout(
    "Invalid quantity (0) throws descriptive error",
    {
      customerName: "Eva Green",
      productCategory: "ELECTRONICS",
      productPrice: 50,
      quantity: 0
    },
    err => err instanceof Error && err.message.includes("Quantity must be a positive integer")
  );

  console.log("=================================================");
  console.log(`TOTAL CHECKOUT TESTS: ${totalTests} | PASSED: ${passedCount} | FAILED: ${totalTests - passedCount}`);
  console.log("=================================================\n");

  // Sample Invoice Demonstration
  console.log("SAMPLE INVOICE DISPLAY DEMO:");
  const sampleOrder = {
    customerName: "Sarah Connor",
    productCategory: "ELECTRONICS",
    productPrice: 850.00,
    quantity: 2,
    couponCode: "SUPER20",
    paymentMethod: "DEBIT_CARD"
  };
  const invoice = CheckoutSystem.processOrder(sampleOrder);
  console.log(CheckoutSystem.generateInvoice(invoice));
}

if (require.main === module) {
  runCheckoutTests();
}

module.exports = CheckoutSystem;
