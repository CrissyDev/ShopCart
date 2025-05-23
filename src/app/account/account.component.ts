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
  loading: boolean = true;
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
    // Optional: Reset tab if sidebar changes
    if (option === 'My Orders') {
      this.activeTab = 'Unpaid';
    }
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  hasOrders(tab: string): boolean {
    // Placeholder: return false for now (no real order data)
    return false;
  }

  getTabIcon(tab: string): string {
    switch (tab) {
      case 'Unpaid':
        return 'https://cdn-icons-png.flaticon.com/512/190/190411.png';
      case 'To be Shipped':
        return 'https://cdn-icons-png.flaticon.com/512/2908/2908120.png';
      case 'Shipped':
        return 'https://cdn-icons-png.flaticon.com/512/633/633652.png';
      case 'Completed':
        return 'https://cdn-icons-png.flaticon.com/512/845/845646.png';
      case 'Cancelled':
        return 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png';
      default:
        return '';
    }
  }
}
