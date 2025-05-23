import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/users.interface';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: User | null = null;
  loading = true;
  status: number = 99;

  activeSidebar: string = 'My Orders';
  activeTab: string = 'Unpaid';

  sidebarOptions: string[] = [
    'My Account',
    'My Assets',
    'My Orders',
    'Return/Refund',
    'Wish List',
    'Recent Views',
    'Message',
    'Chats with Sellers'
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (res: User) => {
        this.user = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching user:', err);
        this.status = err.status;
        this.loading = false;
      }
    });
  }

  setSidebar(option: string): void {
    this.activeSidebar = option;
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  hasOrders(tab: string): boolean {
    // Replace this logic with actual order check later
    return false;
  }
}
