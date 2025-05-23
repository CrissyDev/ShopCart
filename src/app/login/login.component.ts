import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    LottieComponent
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  lottieOptions = {
    path: 'https://assets1.lottiefiles.com/packages/lf20_qp1q7mct.json',
    loop: true,
    autoplay: true
  };

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('id', res.id);

        this.router.navigate(['/account']);
      },
      error: () => this.error = 'Login failed. Please check your credentials.'
    });
  }
}
