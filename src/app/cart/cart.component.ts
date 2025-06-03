import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../models/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  cart!: Cart;
  loading = true;

  ngOnInit(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cart = res;
        this.calculateCartTotals();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch cart:', err);
        this.loading = false;
      }
    });
  }

  increaseQuantity(itemIndex: number) {
    this.cart.products[itemIndex].quantity++;
    this.recalculateItem(itemIndex);
  }

  decreaseQuantity(itemIndex: number) {
    if (this.cart.products[itemIndex].quantity > 1) {
      this.cart.products[itemIndex].quantity--;
      this.recalculateItem(itemIndex);
    }
  }

  deleteItem(index: number) {
    const removed = this.cart.products.splice(index, 1);
    if (removed.length) {
      const el = document.querySelectorAll('.cart-item')[index];
      if (el) {
        el.classList.add('fade-out');
        setTimeout(() => {
          this.calculateCartTotals();
        }, 300); // match CSS fade-out duration
      }
    }
  }

  recalculateItem(index: number) {
    const item = this.cart.products[index];
    item.total = item.price * item.quantity;
    item.discountedTotal = item.total * (1 - item.discountedPercentage / 100);
    this.calculateCartTotals();
  }

  calculateCartTotals() {
    let subtotal = 0;
    let discounted = 0;
    let totalProducts = 0;

    for (const product of this.cart.products) {
      subtotal += product.price * product.quantity;
      discounted += product.total * (product.discountedPercentage / 100);
      totalProducts += product.quantity;
    }

    this.cart.total = subtotal;
    this.cart.discountedTotal = discounted;
    this.cart.totalProducts = totalProducts;
  }
}
