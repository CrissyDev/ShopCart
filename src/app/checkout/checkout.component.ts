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
placeOrder() {
throw new Error('Method not implemented.');
}
mpesaNumber: any;
paypalEmail: any;
selectPayment(arg0: string) {
throw new Error('Method not implemented.');
}
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
selectedPayment: any;
mpesaName: any;

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
    if (this.paymentMethod === 'mpesa') {
      return /^[0-9]{10}$/.test(this.paymentDetails.phone);
    }

    if (this.paymentMethod === 'paypal') {
      return (
        this.paymentDetails.paypal &&
        this.paymentDetails.paypal.includes('@') &&
        !/^\d+$/.test(this.paymentDetails.paypal)
      );
    }

    if (this.paymentMethod === 'card') {
      const cardValid = /^[0-9]{16}$/.test(this.paymentDetails.cardNumber);
      const cvvValid = /^[0-9]{3}$/.test(this.paymentDetails.cvv);
      const nameValid = this.paymentDetails.name.trim().length > 0;
      const expiryValid = this.paymentDetails.expiry.trim().length > 0;
      return cardValid && cvvValid && nameValid && expiryValid;
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
