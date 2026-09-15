/**
 * Module: removeFromCart
 * Removes an item by ID from the cart
 */

const cart = require("../data/cart");

/**
 * Removes an item from the cart matching the given item ID
 * @param {number} productId
 * @returns {Object|null} The removed item, or null if not found in cart
 */
function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);

  if (index === -1) {
    console.log(`[Remove from Cart] Item with ID ${productId} not found in cart.`);
    return null;
  }

  const removedItem = cart.splice(index, 1)[0];
  console.log(`[Remove from Cart] Removed "${removedItem.name}" from cart.`);
  return removedItem;
}

module.exports = removeFromCart;
