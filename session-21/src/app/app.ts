import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // 1. Available Products List (using Product model)
  readonly products: Product[] = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Smartphone', price: 699 },
    { id: 3, name: 'Wireless Headphones', price: 149 },
    { id: 4, name: 'Mechanical Keyboard', price: 89 },
    { id: 5, name: 'Gaming Mouse', price: 49 },
    { id: 6, name: 'Smartwatch', price: 199 }
  ];

  // 2. Cart Signal (initial value is empty array)
  cart = signal<Product[]>([]);

  // 3. Computed Total Price Signal
  totalPrice = computed(() =>
    this.cart().reduce((sum, product) => sum + product.price, 0)
  );

  // 4. Angular Effect: logs cart items count whenever cart signal changes
  constructor() {
    effect(() => {
      console.log(`Cart items count: ${this.cart().length}`);
    });
  }

  // 5. Add Product to Cart using update()
  addToCart(product: Product): void {
    this.cart.update((currentCart) => [...currentCart, product]);
  }

  // 6. Remove Product from Cart using update()
  removeFromCart(productId: number): void {
    this.cart.update((currentCart) =>
      currentCart.filter((product) => product.id !== productId)
    );
  }

  // 7. Clear Cart using set()
  clearCart(): void {
    this.cart.set([]);
  }
}
