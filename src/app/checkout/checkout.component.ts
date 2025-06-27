import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../models/cart.interface';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  step = 1;
  success = false;
  cart: Cart | null = null;
  orderId = '';

  paymentDetails = {
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedCart = localStorage.getItem('user_cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.recalculateCartTotals();
      this.orderId = this.generateOrderId();
    }
  }

recalculateCartTotals() {
  if (!this.cart) return;

  let total = 0;
  let totalQuantity = 0;

  this.cart.products.forEach(item => {
    item.total = item.price * item.quantity;
    total += item.total;
    totalQuantity += item.quantity;
  });

  this.cart.total = total;
  this.cart.discountedTotal = total * 0.9; 
  this.cart.totalProducts = totalQuantity;
  this.cart.totalQuantity = totalQuantity;
}

  generateOrderId(): string {
    return 'ORDER-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  nextStep(): void {
    if (this.step === 2 && !this.validatePayment()) {
      alert('Please fill in all payment details.');
      return;
    }

    if (this.step === 3) {
      this.success = true;
      setTimeout(() => this.router.navigate(['/']), 3000);
      return;
    }

    this.step++;
  }

  validatePayment(): boolean {
    const { name, cardNumber, expiry, cvv } = this.paymentDetails;
    return !!(name && cardNumber && expiry && cvv);
  }
}
