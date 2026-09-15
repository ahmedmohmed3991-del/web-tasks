/**
 * Module: calculateTotal
 * Calculates total price of items in the cart
 */

const cart = require("../data/cart");

/**
 * Calculates and returns the total monetary sum of items in the cart
 * @returns {number} Total cart price
 */
function calculateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const roundedTotal = Math.round((total + Number.EPSILON) * 100) / 100;
  console.log(`[Calculate Total] Cart Total: $${roundedTotal.toFixed(2)}`);
  return roundedTotal;
}

module.exports = calculateTotal;
