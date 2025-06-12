import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { User } from '../models/users.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user: User | null = null;

  selectedLanguage = 'Eng';
  selectedLocation = 'Nairobi';

  languages = ['Eng', 'Swahili', 'French'];
  locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru'];

  private authService = inject(AuthService); 
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
  
    this.authService.getCurrentUser().subscribe({
      next: (res) => this.user = res,
      error: (err) => console.error('User fetch error:', err)
    });
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
