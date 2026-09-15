/**
 * Project 1: Simple Shopping Cart
 * Main Entry Point: index.js
 *
 * Controls the flow of shopping cart operations:
 * - Adding products to cart
 * - Removing products
 * - Listing items
 * - Calculating total
 */

const addToCart = require("./modules/addToCart");
const removeFromCart = require("./modules/removeFromCart");
const listCart = require("./modules/listCart");
const calculateTotal = require("./modules/calculateTotal");
const products = require("./data/products");
const cart = require("./data/cart");

function runShoppingCartApp() {
  console.log("=================================================");
  console.log("     PROJECT 1: SIMPLE SHOPPING CART SYSTEM      ");
  console.log("=================================================\n");

  console.log("Available Products:");
  products.forEach((p) => console.log(`  - [ID ${p.id}] ${p.name}: $${p.price.toFixed(2)}`));
  console.log("");

  // 1. Add products to cart
  console.log("--- 1. Adding Products to Cart ---");
  addToCart(1); // Wireless Headphones ($99.99)
  addToCart(3); // Gaming Mouse ($45.00)
  addToCart(4); // USB-C Hub ($29.99)

  // 2. List cart items
  console.log("\n--- 2. Listing Current Cart Items ---");
  listCart();

  // 3. Calculate initial total
  console.log("--- 3. Calculating Total Price ---");
  const initialTotal = calculateTotal(); // 99.99 + 45.00 + 29.99 = 174.98

  // 4. Remove an item
  console.log("\n--- 4. Removing Item from Cart (ID 3 - Gaming Mouse) ---");
  removeFromCart(3);

  // 5. List updated cart items
  console.log("\n--- 5. Listing Updated Cart Items ---");
  listCart();

  // 6. Calculate updated total
  console.log("--- 6. Calculating Updated Total Price ---");
  const updatedTotal = calculateTotal(); // 99.99 + 29.99 = 129.98

  // Verification
  console.log("\n--- Verification Summary ---");
  const isInitialTotalCorrect = initialTotal === 174.98;
  const isUpdatedTotalCorrect = updatedTotal === 129.98;
  const isCartLengthCorrect = cart.length === 2;

  console.log(`Add & Calculate Initial Total ($174.98): ${isInitialTotalCorrect ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Remove Item & Update Total ($129.98)   : ${isUpdatedTotalCorrect ? "PASS [OK]" : "FAIL [X]"}`);
  console.log(`Cart Final Item Count (2 items)        : ${isCartLengthCorrect ? "PASS [OK]" : "FAIL [X]"}`);

  console.log("\n=================================================");
  console.log("       SHOPPING CART OPERATIONS COMPLETED        ");
  console.log("=================================================\n");

  return {
    initialTotal,
    updatedTotal,
    finalCartCount: cart.length
  };
}

if (require.main === module) {
  runShoppingCartApp();
}

module.exports = runShoppingCartApp;
