# SESSION 21 — Shopping Cart Application Using Angular Signals

A clean, reactive Shopping Cart web application built using **Angular Signals** (`signal`, `set`, `update`, `computed`, `effect`) and modern Angular control flow (`@for`, `@if`).

---

## 🎯 1. Project

**Shopping Cart Application Using Angular Signals**

---

## 💡 2. Purpose

The purpose of this application is to demonstrate modern reactive state management in Angular using the official **Angular Signals API**. The application manages available products, real-time cart mutations, derived calculations, and side effects without external state libraries, RxJS subjects, or manual UI synchronization.

---

## 🧠 3. Concepts Demonstrated

### A. `signal()`
Used to store the reactive state of products currently added to the shopping cart:
```typescript
cart = signal<Product[]>([]);
```
The initial cart state starts as an empty array.

### B. `update()`
Used to immutably modify the existing cart signal state based on its current value:
- **Adding a product to cart**:
  ```typescript
  this.cart.update(currentCart => [...currentCart, product]);
  ```
- **Removing a product from cart**:
  ```typescript
  this.cart.update(currentCart =>
    currentCart.filter(product => product.id !== productId)
  );
  ```

### C. `set()`
Used to directly replace the signal value with a new value. Specifically demonstrated in the **Clear Cart** action:
```typescript
this.cart.set([]);
```
This clearly highlights the architectural difference between modifying state via `update()` and replacing state via `set()`.

### D. `computed()`
Used to create a memoized, derived reactive signal that automatically calculates the total price of all items in the cart:
```typescript
totalPrice = computed(() =>
  this.cart().reduce((sum, product) => sum + product.price, 0)
);
```
The total price recalculates automatically whenever items are added, removed, or cleared without manual intervention.

### E. `effect()`
Used to declare a side effect that automatically tracks and runs whenever the `cart` signal changes:
```typescript
constructor() {
  effect(() => {
    console.log(`Cart items count: ${this.cart().length}`);
  });
}
```
Whenever a product is added, removed, or the cart is cleared, the effect executes and prints the updated count to the browser console.

### F. Angular Modern Control Flow (`@for` & `@if`)
- **`@for`**: Used to iterate over both available products and cart items:
  ```html
  @for (product of cart(); track product.id) {
    ...
  }
  ```
- **`@if`**: Used to display the `"Your cart is empty"` message when the cart has zero items.

---

## ✨ 4. Features

- **Display Products**: Renders a catalog of available products (Name, Price, and "Add To Cart" button).
- **Add Products to Cart**: Clicking "Add To Cart" adds the selected item using `this.cart.update(...)`.
- **Remove Products**: Each item in the cart has a "Remove" button that filters out the item using `this.cart.update(...)`.
- **Calculate Total Price**: Displays the live total price using the `totalPrice` `computed()` signal.
- **Clear Cart**: Resets the cart to an empty state using `this.cart.set([])`.
- **Empty Cart Notification**: Visibly displays `"Your cart is empty"` whenever the cart is empty.
- **Track Cart Changes**: Automatically logs `Cart items count: <count>` via Angular's `effect()`.

---

## 📁 5. Project Structure

```
session-21/
├── src/
│   ├── app/
│   │   ├── app.ts               # Standalone component logic with Signals
│   │   ├── app.html             # Template with @for, @if, and signal bindings
│   │   ├── app.css              # Clean layout styling for products and cart
│   │   ├── app.config.ts        # App configuration
│   │   ├── app.spec.ts          # Comprehensive unit & DOM test suite
│   │   └── product.model.ts     # Product model interface (id, name, price)
│   ├── index.html               # Main HTML entry point
│   ├── main.ts                  # Bootstrap file
│   └── styles.css               # Global typography & color variables
├── angular.json                 # Angular CLI configuration
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript settings
└── README.md                    # Documentation
```

---

## 🚀 6. How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Commands
```bash
# 1. Navigate into the session-21 folder
cd session-21

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Angular development server
npm start
# or: ng serve
```
Open your web browser and navigate to `http://localhost:4200/`.

### Running Unit Tests
```bash
npm test -- --watch=false
```

### Production Build
```bash
npm run build
```
Compiled output is generated in `dist/session-21`.

---

## 🧪 7. Test Results

Executed automated test suite via Vitest (`npm test -- --watch=false`):

```text
 ✓  session-21  src/app/app.spec.ts (7 tests) 171ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
```

1. **Initial State**: Products rendered, cart starts empty, shows `"Your cart is empty"`, total price is `$0`.
2. **Add Product**: Adds product via `update()`, updates total price, and triggers `effect()`.
3. **Add Multiple Products**: Correctly sums all product prices and logs count.
4. **Remove Product**: Removes item via `update()`, updates computed total price, and logs count.
5. **Clear Cart**: Resets cart via `set([])`, restores `"Your cart is empty"` message, sets total to `$0`.
6. **Signal APIs Verification**: Asserts that `isSignal(cart)` and `isSignal(totalPrice)` are true, and verifies `update()` and `set()` methods.
7. **DOM Interactions**: Verifies clicks on Add To Cart, Remove, and Clear Cart buttons update the DOM automatically.
