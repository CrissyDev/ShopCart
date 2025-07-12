import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.forgotForm.valid) {
      this.loading = true;
      const email = this.forgotForm.value.email;
      console.log('Reset email sent to:', email);

      setTimeout(() => {
        this.loading = false;
        this.successMessage = 'Reset code sent successfully to your email.';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);

      }, 2000); 

    } else {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }
}
