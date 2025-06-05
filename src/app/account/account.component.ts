import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    }
  ];

  unpaidOrders = [
    {
      title: 'Eco-Friendly Mug',
      price: '$12.99',
      image: 'https://images.pexels.com/photos/2333059/pexels-photo-2333059.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  paidOrders = [
    {
      title: 'Organic T-Shirt',
      price: '$25.00',
      image: 'https://images.pexels.com/photos/7679725/pexels-photo-7679725.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Bamboo Toothbrush',
      price: '$4.99',
      image: 'https://images.pexels.com/photos/3735201/pexels-photo-3735201.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Reusable Straw Set',
      price: '$7.50',
      image: 'https://images.pexels.com/photos/3029333/pexels-photo-3029333.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Solar Powered Charger',
      price: '$45.00',
      image: 'https://images.pexels.com/photos/3985601/pexels-photo-3985601.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Recycled Paper Notebook',
      price: '$9.99',
      image: 'https://images.pexels.com/photos/1112049/pexels-photo-1112049.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Organic Cotton Tote Bag',
      price: '$15.00',
      image: 'https://images.pexels.com/photos/1435178/pexels-photo-1435178.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  returnRefunds = [
    {
      title: 'Reusable Straw Set',
      reason: 'Defective item',
      dateReturned: '2025-05-20',
      progress: 60, // percentage
      image: 'https://images.pexels.com/photos/3029333/pexels-photo-3029333.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Bamboo Toothbrush',
      reason: 'Changed mind',
      dateReturned: '2025-05-15',
      progress: 85,
      image: 'https://images.pexels.com/photos/3735201/pexels-photo-3735201.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  wishList = [
    {
      title: 'Eco Lamp',
      image: 'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  recentViews = [
    {
      title: 'Wooden Brush',
      image: 'https://images.pexels.com/photos/3735201/pexels-photo-3735201.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  messages = [
    {
      id: 1,
      from: 'Support Team',
      content: 'Your refund request has been approved.',
      date: '2025-06-01',
      unread: true
    },
    {
      id: 2,
      from: 'Support Team',
      content: 'We received your inquiry.',
      date: '2025-05-28',
      unread: false
    }
  ];

  chats = [
    {
      id: 1,
      seller: 'GreenShopKE',
      message: 'Your product is ready for dispatch.',
      time: '2 hours ago',
      unread: true,
      icon: 'https://cdn-icons-png.flaticon.com/512/2983/2983783.png'
    },
    {
      id: 2,
      seller: 'EcoGoods',
      message: 'Can you confirm delivery address?',
      time: '1 day ago',
      unread: false,
      icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922560.png'
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

  checkout(order: any) {
    window.location.href = '/page-not-found';
  }

  deleteOrder(order: any) {
    this.unpaidOrders = this.unpaidOrders.filter(o => o !== order);
  }
}
