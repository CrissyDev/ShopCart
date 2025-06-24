import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../models/cart.interface';
import { RouterModule } from '@angular/router';
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
  private cdr = inject(ChangeDetectorRef); 

  cart: Cart = {
    id: 0,
    userId: 0,
    total: 0,
    discountedTotal: 0,
    totalProducts: 0,
    totalQuantity: 0,
    products: []
  };
  loading = true;

  ngOnInit(): void {
    const storedCart = localStorage.getItem('userCart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.calculateCartTotals();
      this.loading = false;
    } else {
      this.loadCart();
    }
  }

  loadCart() {
    this.loading = true;
    this.cartService.getUserCart().subscribe({
      next: (res: { carts: Cart[] }) => {
        if (res.carts && res.carts.length > 0) {
          this.cart = res.carts[0];
          this.calculateCartTotals();
          this.saveCartToStorage();
        } else {
          this.resetCart(); 
        }
        this.loading = false;
      },
      error: () => {
        this.resetCart(); 
        this.loading = false;
      }
    });
  }

  resetCart() {
    this.cart = {
      id: 0,
      userId: 0,
      total: 0,
      discountedTotal: 0,
      totalProducts: 0,
      totalQuantity: 0,
      products: []
    };
    localStorage.removeItem('userCart');
    this.cdr.detectChanges();
  }

  saveCartToStorage() {
    localStorage.setItem('userCart', JSON.stringify(this.cart));
  }

  increaseQuantity(index: number) {
    this.cart.products[index].quantity++;
    this.recalculateItem(index);
    this.syncCart();
  }

  decreaseQuantity(index: number) {
    if (this.cart.products[index].quantity > 1) {
      this.cart.products[index].quantity--;
      this.recalculateItem(index);
      this.syncCart();
    }
  }

  deleteItem(index: number) {
    const productId = this.cart.products[index].id;
    const el = document.querySelectorAll('.cart-item')[index];
    if (el) el.classList.add('fade-out');

    setTimeout(() => {
      this.cartService.deleteCartItem(this.cart.id, productId).subscribe({
        next: () => {
          this.cart.products.splice(index, 1);

          if (this.cart.products.length === 0) {
            this.resetCart(); 
          } else {
            this.calculateCartTotals();
            this.saveCartToStorage();
          }
        },
        error: (err) => {
          console.error('Failed to delete item from cart:', err);
        }
      });
    }, 300);
  }

  recalculateItem(index: number) {
    const item = this.cart.products[index];
    item.total = item.price * item.quantity;
    const discountRate = (item.discountedPercentage || 0) / 100;
    item.discountedTotal = item.total - (item.total * discountRate);
    this.calculateCartTotals();
  }

  calculateCartTotals() {
    let subtotal = 0;
    let discounted = 0;
    let totalProducts = 0;

    for (const product of this.cart.products) {
      const total = product.price * product.quantity;
      const discountRate = (product.discountedPercentage || 0) / 100;
      const discount = total * discountRate;

      product.total = total;
      product.discountedTotal = total - discount;

      subtotal += total;
      discounted += discount;
      totalProducts += product.quantity;
    }

    this.cart.total = subtotal;
    this.cart.discountedTotal = subtotal - discounted;
    this.cart.totalProducts = totalProducts;

    this.saveCartToStorage();
  }

  syncCart() {
    const simplified = this.cart.products.map((p) => ({
      id: p.id,
      quantity: p.quantity
    }));

    if (this.cart.id !== 0) {
      this.cartService.updateCart(this.cart.id, simplified).subscribe({
        next: (updatedCart) => {
          this.cart = updatedCart;
          this.calculateCartTotals();
        },
        error: (err) => {
          console.error('Error updating cart:', err);
        }
      });
    }
  }
}
