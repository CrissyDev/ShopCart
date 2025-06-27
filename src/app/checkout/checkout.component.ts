import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.interface';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports:[CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  orderId: string = '';
  totalAmount: number = 0;
  discount: number = 0;
  finalAmount: number = 0;

  step: number = 1;
  success: boolean = false;

  paymentDetails = {
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartFromStorage();

    this.cartService.cart$.subscribe(updatedCart => {
      if (updatedCart) {
        this.cart = updatedCart;
        this.calculateOrderSummary();
      }
    });

    this.orderId = this.generateOrderId();
  }

  loadCartFromStorage(): void {
    const storedCart = this.cartService.readCartFromStorage();
    if (storedCart) {
      this.cart = storedCart;
      this.calculateOrderSummary();
    }
  }

  calculateOrderSummary(): void {
    if (!this.cart) return;

    this.totalAmount = this.cart.total || 0;
    this.discount = this.cart.discountedTotal ? this.cart.total - this.cart.discountedTotal : 0;
    this.finalAmount = (this.cart.discountedTotal || this.cart.total) + 15; 
  }

  generateOrderId(): string {
    const now = new Date();
    return 'ORD-' + now.getTime().toString().slice(-8);
  }

  nextStep(): void {
    if (this.step < 3) {
      this.step += 1;
    } else {
      this.completePurchase();
    }
  }

  completePurchase(): void {
    this.success = true;
    this.cartService.readCartFromStorage();
    this.cart = null;
  }
}
