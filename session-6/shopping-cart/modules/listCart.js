/**
 * Module: listCart
 * Logs cart items and returns current cart contents
 */

const cart = require("../data/cart");

/**
 * Logs all items currently in the cart to the console
 * @returns {Array} List of cart items
 */
function listCart() {
  console.log("\n--- Current Cart Contents ---");

  if (cart.length === 0) {
    console.log("  Your cart is empty.");
    console.log("-----------------------------\n");
    return [];
  }

  cart.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.name} (ID: ${item.id}) - $${item.price.toFixed(2)}`);
  });

  console.log("-----------------------------\n");
  return [...cart];
}

module.exports = listCart;
