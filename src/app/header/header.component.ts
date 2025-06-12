import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { UserService } from '../services/user.service';
import { User } from '../models/users.interface';
import { CommonModule } from '@angular/common';

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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.userService.getCurrentUser().subscribe({
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
    localStorage.removeItem('token');
    this.user = null;
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
