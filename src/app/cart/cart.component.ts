import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Cart, CartProduct } from '../models/cart.interface';

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

  cart!: Cart;
  loading = false;
  cartId!: number;
  lastDeletedItem: { product: CartProduct; index: number } | null = null;

  ngOnInit(): void {
    this.loadCartFromLocalStorage();
  }

  loadCartFromLocalStorage() {
    this.loading = true;
    const storedCart = this.cartService.readCartFromStorage();

    if (storedCart != null) {
      this.cart = storedCart;
      this.cartId = storedCart.id;
      this.recalculateCartTotals();
      this.loading = false;
    } else {
      this.loadCartFromAPI();
    }
  }

  loadCartFromAPI() {
    const authUser = this.authService.readAuthUserFromStorage();
    if (authUser) {
      this.cartService.getUserCart(authUser.id).subscribe({
        next: (res) => {
          if (res.carts && res.carts.length > 0) {
            this.cart = res.carts[0];
            this.cartId = this.cart.id;
            this.recalculateCartTotals();
            this.cartService.saveCartToStorage(this.cart);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading cart from API:', err);
          this.loading = false;
        }
      });
    }
  }

  increaseQuantity(cartProduct: CartProduct) {
    cartProduct.quantity++;
    const authUser = this.authService.readAuthUserFromStorage();
    if (authUser) {
      this.cartService.updateCart(authUser.id, cartProduct.id, cartProduct.quantity).subscribe();
    }
  }

  decreaseQuantity(cartProduct: CartProduct) {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity--;
      const authUser = this.authService.readAuthUserFromStorage();
      if (authUser) {
        this.cartService.updateCart(authUser.id, cartProduct.id, cartProduct.quantity).subscribe();
      }
    }
  }

  deleteItem(index: number) {
    const product = this.cart.products[index];
    this.lastDeletedItem = { product: { ...product }, index }; 
    this.cart.products.splice(index, 1);
    this.recalculateCartTotals();
    this.cartService.saveCartToStorage(this.cart);

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
  }
}
