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

        this.auth.getCurrentUser().subscribe({
          next: (res) => {

            console.log("Auth user",res);
            
            let userobj = {
              email: res.email,
              phone: res.phone,
              birthDate: res.birthDate,
              image: res.image,
              createdAt: res.createdAt,
              id: res.id,
              firstName: res.firstName,
              lastName: res.lastName,
              maidenName:res.maidenName,
              age: res.age,
              username: res.username  
            };

            this.auth.saveAuthUserToStorage(userobj);
            this.router.navigate(['/account']);

          },
          error: (err) => console.error('User fetch error:', err)
        });
      },
      error: () => this.error = 'Login failed. Please check your credentials.'
    });
  }
}
