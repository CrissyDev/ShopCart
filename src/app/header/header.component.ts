import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { User } from '../models/users.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: User | null = null;

  selectedLanguage = 'Eng';
  selectedLocation = 'Nairobi';

  languages = ['Eng', 'Swahili', 'French'];
  locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru'];

  totalProducts = 0;

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.authService.getCurrentUser().subscribe({
        next: (res) => this.user = res,
        error: (err) => console.error('User fetch error:', err)
      });

      this.cartService.totalProducts$.subscribe(count => {
        this.totalProducts = count;
      });
    } else {
      console.warn('No token found. Skipping user/cart load.');
    }
  }

  changeLanguage(lang: string): void {
    this.selectedLanguage = lang;
  }

  changeLocation(location: string): void {
    this.selectedLocation = location;
  }

  logout(): void {
    this.authService.logout();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
