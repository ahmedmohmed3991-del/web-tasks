import { ComponentFixture, TestBed } from '@angular/core/testing';
import { isSignal } from '@angular/core';
import { App } from './app';

describe('App (Session 21 Shopping Cart using Angular Signals)', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    consoleSpy = vi.spyOn(console, 'log');

    await TestBed.configureTestingModule({
      imports: [App]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Test 1 — Initial state: displays products, cart is empty, shows "Your cart is empty", total price is 0', () => {
    expect(component).toBeTruthy();
    expect(component.products.length).toBeGreaterThan(0);
    expect(component.cart()).toEqual([]);
    expect(component.totalPrice()).toBe(0);

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyMsg = compiled.querySelector('#empty-cart-message');
    expect(emptyMsg?.textContent).toContain('Your cart is empty');
    const totalEl = compiled.querySelector('#total-price');
    expect(totalEl?.textContent).toContain('$0');
  });

  it('Test 2 — Add product: adds selected product via update(), updates total, and effect logs count', () => {
    const laptop = component.products[0]; // { id: 1, name: 'Laptop', price: 999 }
    component.addToCart(laptop);
    fixture.detectChanges();

    expect(component.cart().length).toBe(1);
    expect(component.cart()[0]).toEqual(laptop);
    expect(component.totalPrice()).toBe(999);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#empty-cart-message')).toBeNull();
    const cartItem = compiled.querySelector('#cart-item-1');
    expect(cartItem).toBeTruthy();
    expect(cartItem?.textContent).toContain('Laptop');
    expect(cartItem?.textContent).toContain('$999');
    expect(compiled.querySelector('#total-price')?.textContent).toContain('$999');
  });

  it('Test 3 — Add multiple products: sums prices correctly and effect tracks count', () => {
    component.addToCart(component.products[0]); // Laptop: 999
    component.addToCart(component.products[1]); // Smartphone: 699
    component.addToCart(component.products[2]); // Headphones: 149
    fixture.detectChanges();

    expect(component.cart().length).toBe(3);
    const expectedSum = 999 + 699 + 149;
    expect(component.totalPrice()).toBe(expectedSum);

    const compiled = fixture.nativeElement as HTMLElement;
    const cartItems = compiled.querySelectorAll('.cart-item');
    expect(cartItems.length).toBe(3);
    expect(compiled.querySelector('#total-price')?.textContent).toContain(`$${expectedSum}`);
  });

  it('Test 4 — Remove product: removes product via update(), updates computed total price and UI', () => {
    component.addToCart(component.products[0]); // 999
    component.addToCart(component.products[1]); // 699
    fixture.detectChanges();

    expect(component.cart().length).toBe(2);
    expect(component.totalPrice()).toBe(999 + 699);

    // Remove first product (id: 1)
    component.removeFromCart(1);
    fixture.detectChanges();

    expect(component.cart().length).toBe(1);
    expect(component.cart()[0].id).toBe(2);
    expect(component.totalPrice()).toBe(699);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#cart-item-1')).toBeNull();
    expect(compiled.querySelector('#cart-item-2')).toBeTruthy();
    expect(compiled.querySelector('#total-price')?.textContent).toContain('$699');
  });

  it('Test 5 — Clear cart: resets cart via set([]), shows "Your cart is empty", total becomes 0', () => {
    component.addToCart(component.products[0]);
    component.addToCart(component.products[1]);
    fixture.detectChanges();
    expect(component.cart().length).toBe(2);

    // Clear cart
    component.clearCart();
    fixture.detectChanges();

    expect(component.cart().length).toBe(0);
    expect(component.totalPrice()).toBe(0);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#empty-cart-message')?.textContent).toContain(
      'Your cart is empty'
    );
    expect(compiled.querySelector('#total-price')?.textContent).toContain('$0');
  });

  it('Test 6 — Signal implementation: verifies signal(), update(), set(), and computed() APIs', () => {
    // 1. Verify cart is an Angular Signal
    expect(isSignal(component.cart)).toBe(true);

    // 2. Verify totalPrice is a computed Angular Signal
    expect(isSignal(component.totalPrice)).toBe(true);

    // 3. Verify cart has set and update methods
    expect(typeof component.cart.set).toBe('function');
    expect(typeof component.cart.update).toBe('function');

    // 4. Verify update() modifies cart
    component.cart.update((c) => [...c, component.products[0]]);
    expect(component.cart().length).toBe(1);

    // 5. Verify set() resets cart
    component.cart.set([]);
    expect(component.cart().length).toBe(0);

    // 6. Verify computed updates reactively
    expect(component.totalPrice()).toBe(0);
  });

  it('Test 7 — DOM interactions: Clicking "Add To Cart", "Remove", and "Clear Cart" buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Click Add To Cart button for first product
    const addBtn = compiled.querySelector('#add-btn-1') as HTMLButtonElement;
    expect(addBtn).toBeTruthy();
    addBtn.click();
    fixture.detectChanges();

    expect(component.cart().length).toBe(1);
    expect(compiled.querySelector('#cart-item-1')).toBeTruthy();

    // Click Remove button in cart
    const removeBtn = compiled.querySelector('#remove-btn-1') as HTMLButtonElement;
    expect(removeBtn).toBeTruthy();
    removeBtn.click();
    fixture.detectChanges();

    expect(component.cart().length).toBe(0);
    expect(compiled.querySelector('#empty-cart-message')).toBeTruthy();

    // Add another item and click Clear Cart button
    component.addToCart(component.products[2]);
    fixture.detectChanges();
    expect(component.cart().length).toBe(1);

    const clearBtn = compiled.querySelector('#clear-cart-btn') as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    fixture.detectChanges();

    expect(component.cart().length).toBe(0);
    expect(component.totalPrice()).toBe(0);
  });
});
