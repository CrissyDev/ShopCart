import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/users.interface';
import { ProductService } from '../services/product.service'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private productService = inject(ProductService); 
  private router = inject(Router);  

  user: User | null = null;

  wishList: any[] = []; 

 
  recentViews: any[] = [];

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

  orders = Array.from({ length: 6 }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    date: `2024-0${(i % 9) + 1}-12`,
    status: ['Shipped', 'Pending', 'Delivered'][i % 3],
    total: 50 + i * 10 
  }));

  unpaidOrders = [
    {
      orderNo: '#010',
      customer: 'Chloem Moralez',
      seller: 'QuickMart',
      items: 4,
      paid: false,
      totalCost: 120,
      createdDate: '2024-09-15',
      status: 'Pending'
    },
    {
      orderNo: '#011',
      customer: 'Chloem Moralez',
      seller: 'Discount World',
      items: 2,
      paid: false,
      totalCost: 45,
      createdDate: '2024-09-16',
      status: 'Pending'
    }
  ];

  paidOrders = [
    {
      orderNo: '#001',
      customer: 'Chloem Moralez',
      seller: 'ABC Traders',
      items: 5,
      paid: true,
      totalCost: 250,
      createdDate: '2024-09-12',
      status: 'Completed'
    },
    {
      orderNo: '#002',
      customer: 'Chloem Moralez',
      seller: 'XYZ Supplies',
      items: 3,
      paid: true,
      totalCost: 60,
      createdDate: '2024-09-13',
      status: 'Completed'
    },
    {
      orderNo: '#003',
      customer: 'Chloem Moralez',
      seller: 'BestBuy Deals',
      items: 10,
      paid: true,
      totalCost: 1000,
      createdDate: '2024-09-14',
      status: 'Completed'
    },
    {
      orderNo: '#004',
      customer: 'Chloem Moralez',
      seller: 'TechCorp Inc.',
      items: 2,
      paid: true,
      totalCost: 60,
      createdDate: '2024-09-10',
      status: 'Completed'
    },
    {
      orderNo: '#005',
      customer: 'Chloem Moralez',
      seller: 'TopSeller Pro',
      items: 1,
      paid: false,
      totalCost: 80,
      createdDate: '2024-09-11',
      status: 'Completed'
    }
  ];

  returnRefunds = [
    {
      title: 'Wireless Headphones',
      reason: 'Faulty on arrival',
      dateReturned: '2025-05-20',
      progress: 85,
      image: 'https://images.pexels.com/photos/373945/pexels-photo-373945.jpeg'
    },
    {
      title: 'Fitness Tracker',
      reason: 'Incorrect color delivered',
      dateReturned: '2025-05-18',
      progress: 100,
      image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  messages = [
    { from: 'Support', content: 'Your order is confirmed', date: '2025-06-01', unread: true },
    { from: 'Jane Doe', content: 'Can we talk?', date: '2025-06-02', unread: false }
  ];

  chats = [
    {
      seller: 'Gadget Shop',
      message: 'Your return is under process',
      time: '2h ago',
      unread: true,
      icon: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    {
      seller: 'Fashion Store',
      message: 'Thanks for your purchase!',
      time: '1 day ago',
      unread: false,
      icon: 'https://randomuser.me/api/portraits/men/65.jpg'
    }
  ];

  ngOnInit(): void {
    const authUser = this.authService.readAuthUserFromStorage();
    console.log("Auth user:", authUser);

    if (authUser !== null) {
      this.user = {
        email: authUser.email,
        phone: authUser.phone,
        address: '123 Green Street, Nairobi, Kenya',
        gender: 'Male',
        birthDate: authUser.birthDate,
        country: 'Kenya',
        joined: '2023-01-10',
        image: authUser.image,
        billingAddress: '456 Billing Lane, Nairobi, Kenya',
        paymentMethods: ['PayPal', 'Mpesa'],
        royaltyPoints: 320,
        createdAt: authUser.createdAt,
        id: authUser.id,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        maidenName: authUser.maidenName,
        age: authUser.age,
        username: authUser.username
      };
    }

    this.loadWishListFromProducts();
    this.loadRecentViewsFromProducts();
  }

  loadWishListFromProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        const randomProducts = res.products.sort(() => 0.5 - Math.random()).slice(0, 6);
        this.wishList = randomProducts.map((p: any) => ({
          brand: p.brand,
          title: p.title,
          image: p.thumbnail,
          price: p.price,
          originalPrice: Math.floor(p.price * 1.2),
          discount: p.discountPercentage ? `${Math.round(p.discountPercentage)}% Off` : null,
          inBag: false
        }));
      },
      error: (err) => console.error('Failed to fetch wishlist products:', err)
    });
  }

  loadRecentViewsFromProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        const lastProducts = res.products.slice(-6).map((p: any) => ({
          brand: p.brand,
          title: p.title,
          image: p.thumbnail,
          price: p.price,
          viewedOn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        }));
        this.recentViews = lastProducts;
      },
      error: (err) => console.error('Failed to fetch recent views:', err)
    });
  }

  toggleBag(item: any) {
    item.inBag = !item.inBag;
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  getSidebarIcon(option: string): string {
    switch (option) {
      case 'My Account': return 'fas fa-user';
      case 'My Orders': return 'fas fa-box';
      case 'Unpaid Orders': return 'fas fa-wallet';
      case 'Paid Orders': return 'fas fa-receipt';
      case 'Return/Refund': return 'fas fa-undo';
      case 'Wish List': return 'fas fa-heart';
      case 'Recent Views': return 'fas fa-eye';
      case 'Message': return 'fas fa-envelope';
      case 'Chats with Sellers': return 'fas fa-comment-dots';
      default: return 'fas fa-question-circle';
    }
  }

 
  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  checkout(order: any) {
    console.log('Checkout for:', order);
  }

  deleteOrder(order: any) {
    console.log('Delete order:', order);
  }

  buyNow(_t173: { title: string; image: string; }) {
    throw new Error('Method not implemented.');
  }

  addToCart(_t173: { title: string; image: string; }) {
    throw new Error('Method not implemented.');
  }
}
