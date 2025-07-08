import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Cart, CartProduct } from '../models/cart.interface';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  cart: Cart = {
    id: 0,
    userId: 0,
    products: [],
    total: 0,
    discountedTotal: 0,
    totalProducts: 0,
    totalQuantity: 0
  };

  loading = false;
  cartId!: number;
  lastDeletedItem: { product: CartProduct; index: number } | null = null;

  ngOnInit(): void {
    this.loadCartFromLocalStorage();
  }

  loadCartFromLocalStorage() {
    this.loading = true;
    const storedCart = this.cartService.readCartFromStorage();
    console.log('Checking local storage for cart:', storedCart);

    if (storedCart) {
      this.cart = storedCart;
      this.cartId = storedCart.id;
      this.recalculateCartTotals();
      console.log('Loaded cart from local storage');

      if (!this.cart.products || this.cart.products.length === 0) {
        console.warn('Cart in local storage is empty — fetching from API');
        this.loadCartFromAPI();
      } else {
        this.loading = false;
      }
    } else {
      console.log('No cart in local storage, calling loadCartFromAPI()');
      this.loadCartFromAPI();
    }
  }

  loadCartFromAPI() {
    console.log('loadCartFromAPI() called');

    const authUser = this.authService.readAuthUserFromStorage();
    if (authUser) {
      this.cartService.getUserCart(authUser.id).subscribe({
        next: (res: any) => {
          console.log('Cart data received from API:', res);

          if (res.carts && res.carts.length > 0) {
            this.cart = res.carts[0] as Cart;
          } else if (res.products && res.products.length > 0) {
            this.cart = res as Cart;
          } else {
            console.warn('No carts or products found from API. Initializing empty cart.');
            this.cart = {
              id: 0,
              userId: authUser.id,
              products: [],
              total: 0,
              discountedTotal: 0,
              totalProducts: 0,
              totalQuantity: 0
            };
          }

          this.cartId = this.cart.id;
          this.recalculateCartTotals();
          this.cartService.saveCartToStorage(this.cart);
          this.loading = false;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Error loading cart from API:', err);
          this.loading = false;
        }
      });
    } else {
      console.log('No authenticated user found, skipping cart API load');
      this.loading = false;
    }
  }

  increaseQuantity(cartProduct: CartProduct) {
    cartProduct.quantity++;
    this.updateCartOnServer(cartProduct);
  }

  decreaseQuantity(cartProduct: CartProduct) {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity--;
      this.updateCartOnServer(cartProduct);
    }
  }

  private updateCartOnServer(cartProduct: CartProduct) {
    const authUser = this.authService.readAuthUserFromStorage();
    if (authUser) {
      this.cartService.updateCart(authUser.id, cartProduct.id, cartProduct.quantity).subscribe({
        next: (updatedCart) => {
          this.cart = updatedCart; 
          this.recalculateCartTotals();
          this.cartService.saveCartToStorage(this.cart);
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Failed to update cart on server:', err);
        }
      });
    } else {
     
      this.recalculateCartTotals();
      this.cartService.saveCartToStorage(this.cart);
      this.cdr.detectChanges();
    }
  }

  deleteItem(index: number) {
    const product = this.cart.products[index];
    this.lastDeletedItem = { product: { ...product }, index };
    this.cart.products.splice(index, 1);
    this.recalculateCartTotals();
    this.cartService.saveCartToStorage(this.cart);
    this.cdr.detectChanges();

    if (this.cartId && product) {
      this.cartService.deleteCartItem(this.cartId, product.id).subscribe({
        next: () => {
          console.log('Item deleted and tracked for undo');
        },
        error: (err) => {
          console.error('Failed to sync delete with server:', err);
        }
      });
    }
  }

  restoreLastDeletedItem() {
    if (!this.lastDeletedItem) return;

    const { product, index } = this.lastDeletedItem;
    this.cart.products.splice(index, 0, product);
    this.recalculateCartTotals();
    this.cartService.saveCartToStorage(this.cart);
    this.cdr.detectChanges();

    const authUser = this.authService.readAuthUserFromStorage();
    if (authUser) {
      this.cartService.addToCart(authUser.id, product).subscribe({
        next: () => {
          console.log('Restored item to server cart');
        },
        error: (err: any) => {
          console.error('Failed to restore item on server:', err);
        }
      });
    }

    this.lastDeletedItem = null;
  }

  recalculateCartTotals() {
    let total = 0;
    let totalQuantity = 0;

    this.cart.products.forEach((item) => {
      item.total = item.price * item.quantity;
      total += item.total;
      totalQuantity += item.quantity;
    });

    this.cart.total = total;
    this.cart.discountedTotal = total * 0.9;
    this.cart.totalProducts = totalQuantity;
    this.cart.totalQuantity = totalQuantity;

    
    this.cdr.markForCheck();
  }
}
