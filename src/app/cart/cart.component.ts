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
        }, 300); 
      }
    }
  }

  recalculateItem(index: number) {
    const item = this.cart.products[index];
    item.total = item.price * item.quantity;
    const discount = (item.discountedPercentage || 0) / 100;
    item.discountedTotal = item.total - (item.total * discount);
    this.calculateCartTotals();
  }

  calculateCartTotals() {
    let subtotal = 0;
    let discounted = 0;
    let totalProducts = 0;

    for (const product of this.cart.products) {
      const itemTotal = product.price * product.quantity;
      const itemDiscountRate = (product.discountedPercentage || 0) / 100;
      const itemDiscount = itemTotal * itemDiscountRate;

      product.total = itemTotal;
      product.discountedTotal = itemTotal - itemDiscount;

      subtotal += itemTotal;
      discounted += itemDiscount;
      totalProducts += product.quantity;
    }

    this.cart.total = subtotal;
    this.cart.discountedTotal = discounted;
    this.cart.totalProducts = totalProducts;
  }
}
