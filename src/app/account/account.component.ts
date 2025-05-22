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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        console.log("myAccount res", res);
        this.user = res;
        this.loading = false;
      },
      error: (err) => {
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
return false; 
  }
}
