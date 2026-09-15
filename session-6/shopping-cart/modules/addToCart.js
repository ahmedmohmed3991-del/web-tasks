/**
 * Module: addToCart
 * Adds a product by ID to the cart
 */

const products = require("../data/products");
const cart = require("../data/cart");

/**
 * Adds a product to the cart by its product ID
 * @param {number} productId
 * @returns {Object|null} The added cart item, or null if product not found
 */
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    console.log(`[Add to Cart] Product with ID ${productId} not found.`);
    return null;
  }

  // Add a copy of product into the cart
  const cartItem = { ...product };
  cart.push(cartItem);
  console.log(`[Add to Cart] Added "${product.name}" ($${product.price.toFixed(2)}) to cart.`);
  return cartItem;
}

module.exports = addToCart;
