import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.interface';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  orderId: string = '';
  subtotal: number = 0;
  discount: number = 0;
  deliveryFee: number = 15;
  finalAmount: number = 0;

  step: number = 1;
  success: boolean = false;
  loading: boolean = false;

  paymentMethod: string = '';

  paymentDetails: any = {
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    phone: '',
    paypal: ''
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
    if (!this.cart || !this.cart.products) return;

    this.subtotal = this.cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    this.discount = this.cart.products.reduce((sum, item) => {
      const originalTotal = item.price * item.quantity;
      return sum + (originalTotal - item.discountedTotal);
    }, 0);

    this.finalAmount = parseFloat(
      (this.subtotal - this.discount + this.deliveryFee).toFixed(2)
    );
  }

  generateOrderId(): string {
    const now = new Date();
    return 'ORD-' + now.getTime().toString().slice(-8);
  }

  nextStep(): void {
    if (this.step === 2 && !this.validatePaymentDetails()) {
      alert('Please fill in all required payment details correctly.');
      return;
    }

    if (this.step === 3) {
      this.completePurchase();
    } else {
      this.step += 1;
    }
  }

  validatePaymentDetails(): boolean {
    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\d][\w._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const cardNumberRegex = /^[0-9]{16}$/;
    const cvvRegex = /^[0-9]{3}$/;

    if (this.paymentMethod === 'mpesa') {
      return (
        nameRegex.test(this.paymentDetails.name) &&
        phoneRegex.test(this.paymentDetails.phone)
      );
    }

    if (this.paymentMethod === 'paypal') {
      return emailRegex.test(this.paymentDetails.paypal);
    }

    if (this.paymentMethod === 'card') {
      return (
        nameRegex.test(this.paymentDetails.name) &&
        cardNumberRegex.test(this.paymentDetails.cardNumber) &&
        this.paymentDetails.expiry.trim().length > 0 &&
        cvvRegex.test(this.paymentDetails.cvv)
      );
    }

    return false;
  }

  completePurchase(): void {
    this.loading = true;

    setTimeout(() => {
      this.triggerConfetti();
      this.success = true;
      this.loading = false;

      setTimeout(() => {
        this.cartService.clearCart();
        this.cart = null;
        window.location.href = '/';
      }, 5000);
    }, 2000);
  }

  goBack(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  navigateToCart(): void {
    window.location.href = '/cart';
  }

  placeOrder(): void {
    if (!this.cart || this.finalAmount <= 0) {
      alert('Your cart is empty or total amount is invalid.');
      return;
    }

    this.nextStep();
  }

  triggerConfetti(): void {
    import('canvas-confetti' as any).then((confetti: any) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    });
  }
}
