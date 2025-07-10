import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
 
  emailSent: boolean = false;

  emailSubscriptionForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  sendEmail(): void {
    if (this.emailSubscriptionForm.valid) {
      this.emailSent = true;
      
      this.emailSubscriptionForm.reset();

      setTimeout(() => {
        this.emailSent = false;
      }, 3000);
    }
  }
}
