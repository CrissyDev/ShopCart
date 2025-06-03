import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  user = {
    name: 'Chloem Morales',
    email: 'ChloemMorales@gmail.com',
    phone: '+254 712 345678',
    address: '123 Market St, Nairobi, Kenya',
    image: 'https://images.pexels.com/photos/17300044/pexels-photo-17300044/free-photo-of-black-women.jpeg?auto=compress&cs=tinysrgb&w=600'
  };

  orders = [
    {
      id: 'ORD12345',
      date: '2025-05-30',
      status: 'Delivered',
      total: '$89.99',
      image: 'https://images.pexels.com/photos/3682292/pexels-photo-3682292.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'ORD12346',
      date: '2025-05-28',
      status: 'Processing',
      total: '$45.50',
      image: 'https://images.pexels.com/photos/3682292/pexels-photo-3682292.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  sidebarOptions: string[] = [
    'My Account',
    'My Orders',
    'Unpaid Orders',
    'Paid Orders',
    'Return/Refund',
    'Wish List',
    'Recent Views',
    'Message',
    'Chats with Sellers'
  ];

  selectedOption: string = 'My Account';

  getSidebarIcon(option: string): string {
    switch (option) {
      case 'My Account': return 'fas fa-user-circle';
      case 'My Orders': return 'fas fa-shopping-bag';
      case 'Unpaid Orders': return 'fas fa-wallet';
      case 'Paid Orders': return 'fas fa-money-check-alt';
      case 'Return/Refund': return 'fas fa-undo';
      case 'Wish List': return 'fas fa-heart';
      case 'Recent Views': return 'fas fa-history';
      case 'Message': return 'fas fa-envelope';
      case 'Chats with Sellers': return 'fas fa-comments';
      default: return 'fas fa-circle';
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
