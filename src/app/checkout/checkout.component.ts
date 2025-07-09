import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.interface';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgxMaskDirective],
   providers: [provideNgxMask()],
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

  paymentForm!: FormGroup;
  selectedPaymentMethod: string = '';
  paymentMethod: string = '';
  paymentDetails: any = {};

  constructor(private cartService: CartService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadCartFromStorage();

    this.cartService.cart$.subscribe(updatedCart => {
      if (updatedCart) {
        this.cart = updatedCart;
        this.calculateOrderSummary();
      }
    });

    this.orderId = this.generateOrderId();
    this.initForm();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{3,}$/)]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      paypal: ['', [Validators.email]],
      cardNumber: ['', [Validators.pattern(/^[0-9]{16}$/)]],
      expiry: ['', [Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.pattern(/^[0-9]{3}$/)]]
    });
  }

 
  get name() {
    return this.paymentForm.get('name');
  }

  get phone() {
    return this.paymentForm.get('phone');
  }

  get paypal() {
    return this.paymentForm.get('paypal');
  }

  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }

  get expiry() {
    return this.paymentForm.get('expiry');
  }

  get cvv() {
    return this.paymentForm.get('cvv');
  }

  
  selectPayment(method: string): void {
    this.paymentMethod = method;
    this.selectedPaymentMethod = method;

    this.paymentForm.reset();
    this.initForm();

    if (method === 'mpesa') {
      this.name?.setValidators([Validators.required, Validators.pattern(/^[A-Za-z\s]{3,}$/)]);
      this.phone?.setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
    }

    if (method === 'paypal') {
      this.paypal?.setValidators([Validators.required, Validators.email]);
    }

    if (method === 'card') {
      this.name?.setValidators([Validators.required, Validators.pattern(/^[A-Za-z\s]{3,}$/)]);
      this.cardNumber?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
      this.expiry?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.cvv?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3}$/)]);
    }

    this.paymentForm.updateValueAndValidity();
  }

  nextStep(): void {
    if (this.step === 2 && this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (this.step === 3) {
      this.completePurchase();
    } else {
      this.step += 1;
    }
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
    if (!this.cart || this.finalAmount <= 0 || isNaN(this.finalAmount)) {
      alert('Your cart is empty or total amount is invalid.');
      return;
    }

    this.nextStep();
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

  triggerConfetti(): void {
    import('canvas-confetti' as any).then((confetti: any) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    });
  }

  loadCartFromStorage(): void {
    const storedCart = this.cartService.readCartFromStorage();
    if (storedCart) {
      this.cart = storedCart;
      this.calculateOrderSummary();
    }
  }

  calculateOrderSummary(): void {
    if (!this.cart || !Array.isArray(this.cart.products) || this.cart.products.length === 0) {
      this.subtotal = 0;
      this.discount = 0;
      this.finalAmount = 0;
      return;
    }

    this.subtotal = this.cart.products.reduce((sum, item) => {
      const productTotal = item.price && item.quantity ? item.price * item.quantity : 0;
      return sum + productTotal;
    }, 0);

    this.discount = this.cart.products.reduce((sum, item) => {
      const originalTotal = item.price * item.quantity;
      const discounted = item.discountedTotal ?? originalTotal;
      return sum + (originalTotal - discounted);
    }, 0);

    this.finalAmount = parseFloat(
      ((this.subtotal - this.discount) + this.deliveryFee).toFixed(2)
    );

    if (isNaN(this.subtotal)) this.subtotal = 0;
    if (isNaN(this.discount)) this.discount = 0;
    if (isNaN(this.finalAmount)) this.finalAmount = 0;
  }

  generateOrderId(): string {
    const now = new Date();
    return 'ORD-' + now.getTime().toString().slice(-8);
  }

  formatMoney(value: number | null | undefined): string {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  }

  getCardLast4(): string {
    const cardNumber = this.paymentForm.get('cardNumber')?.value;
    if (!cardNumber) return '';
    return cardNumber.replace(/\s/g, '').slice(-4);
  }
}
