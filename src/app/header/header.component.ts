import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/users.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found  skipping user fetch.');
      return;
    }

    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('Authenticated user:', res);
        this.user = res;
      },
      error: (err) => {
        console.error('Error fetching user:', err.message || err);
      }
    });
  }
}
