import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.interface';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function fullNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim();

    if (!value) return null;

    const words = value.split(/\s+/);

    const allWordsValid = words.every((word: string) => /^[A-Za-z]{3,}$/.test(word));

    if (!allWordsValid) {
      return { invalidCharactersOrTooShort: true };
    }

    return null;
  };
}



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

  selectedPaymentMethod: string = '';
  paymentMethod: string = '';
  paymentDetails: any = {};

  mpesaForm = new FormGroup({
    mpesaName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z ]+$/)]),
    mpesaPhone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]+$/)])
  });

  paypalForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  cardForm = new FormGroup({
    name: new FormControl('', [Validators.required, fullNameValidator()]),
    cardNumber: new FormControl('',[Validators.required, Validators.pattern(/^[0-9]+$/)]),
    expiry: new FormControl('',[Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]),
    cvv: new FormControl('',[Validators.required, Validators.maxLength(3),Validators.pattern(/^[0-9]+$/)]),
  });

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
  }

  get mpesa_name() { 
    return this.mpesaForm.get('mpesaName');
  }

  get mpesa_phone() { 
    return this.mpesaForm.get('mpesaPhone');
  }

  selectPayment(method: string): void {
    this.paymentMethod = method;
    this.selectedPaymentMethod = method;

    switch (method) {
      case 'mpesa':
        this.mpesaForm.reset();
        break;
      case 'paypal':
        this.paypalForm.reset();
        break;
      case 'card':
        this.cardForm.reset();
        break;
    }

    //this.paymentForm.updateValueAndValidity();
  }

  isPaymentInfoValid(): boolean {
    return (this.mpesaForm.valid || this.paypalForm.valid || this.cardForm.valid);
  }


  nextStep(): void {
    // if (this.step === 2 && this.isPaymentInfoValid()) {
    //   this.mpesaForm.markAllAsTouched();
    //   this.paypalForm.markAllAsTouched();
    //   this.cardForm.markAllAsTouched();
    //   return;
    // }

    // if (this.step === 3) {
    //   this.completePurchase();
    // } else {
    //   this.step += 1;
    // }

    console.log('prev step ', this.step);
    this.step += 1;
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
    const cardNumber = this.cardForm.get('cardNumber')?.value;
    if (!cardNumber) return '';
    return cardNumber.replace(/\s/g, '').slice(-4);
  }
}
