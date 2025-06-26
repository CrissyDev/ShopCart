import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone:true,
  imports:[CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  step = 1;
  success = false;

  paymentDetails = {
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  constructor(private router: Router) {}

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
