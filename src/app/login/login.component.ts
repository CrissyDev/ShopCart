import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { LottieComponent } from 'ngx-lottie';

declare const bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LottieComponent
  ]
})
export class LoginComponent {
  error = '';

  lottieOptions = {
    path: 'https://assets1.lottiefiles.com/packages/lf20_qp1q7mct.json',
    loop: true,
    autoplay: true
  };

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    if (this.loginForm.valid) {
      this.auth
        .login(
          this.loginForm.get('username')?.value || '',
          this.loginForm.get('password')?.value || ''
        )
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.accessToken);

            this.auth.getCurrentUser().subscribe({
              next: (res) => {
                console.log('Auth user', res);

                let userobj = {
                  email: res.email,
                  phone: res.phone,
                  birthDate: res.birthDate,
                  image: res.image,
                  createdAt: res.createdAt,
                  id: res.id,
                  firstName: res.firstName,
                  lastName: res.lastName,
                  maidenName: res.maidenName,
                  age: res.age,
                  username: res.username
                };

                this.auth.saveAuthUserToStorage(userobj);
                this.router.navigate(['/account']);
              },
              error: (err) => console.error('User fetch error:', err)
            });
          },
          error: () => (this.error = 'Login failed. Please check your credentials.')
        });
    }
  }

  openForgotPasswordModal(event: Event): void {
    event.preventDefault();
    const modalElement = document.getElementById('forgotPasswordModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  navigateToForgotPassword(): void {
    const modalElement = document.getElementById('forgotPasswordModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
    this.router.navigate(['/forgot-password']);
  }
}
