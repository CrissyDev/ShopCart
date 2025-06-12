import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/users.interface';

@Component({
  selector: 'app-account',
  imports:[CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit{

  private http = inject(HttpClient);
  private authService = inject(AuthService); 
  user: User | null = null;

  ngOnInit(): void {
   this.authService.getCurrentUser().subscribe({
      next: (res) => {

        console.log("Auth user",res);
        
        let userobj = {
          email: res.email,
          phone: res.phone,
          address: '123 Green Street, Nairobi, Kenya',
          gender: 'Male',
          birthDate: res.birthDate,
          country: 'Kenya',
          joined: '2023-01-10',
          image: res.image,
          billingAddress: '456 Billing Lane, Nairobi, Kenya',
          paymentMethods: ['PayPal', 'Mpesa'],
          royaltyPoints: 320,
          createdAt: res.createdAt,
          id: res.id,
          firstName: res.firstName,
          lastName: res.lastName,
          maidenName:res.maidenName,
          age: res.age,
          username: res.username  
        };

        this.user = userobj;

      },
      error: (err) => console.error('User fetch error:', err)
    });
  }



buyNow(_t173: { title: string; image: string; }) {
  throw new Error('Method not implemented.');
}

addToCart(_t173: { title: string; image: string; }) {
throw new Error('Method not implemented.');
}
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
    total: `$${(50 + i * 10).toFixed(2)}`
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

  wishList = [
  {
    brand: 'Louis Vuitton',
    title: 'Star Trail ankle boot 8CM',
    image: 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg',
    price: 1350,
    originalPrice: 1500,
    discount: '10% Off',
    inBag: false
  },
  {
    brand: 'Prada',
    title: 'Saffiano leather medium bag',
    image: 'https://images.pexels.com/photos/3689163/pexels-photo-3689163.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 1990,
    inBag: true
  },
  {
    brand: 'Valentino',
    title: 'Roman stud handle bag',
    image: 'https://images.pexels.com/photos/1394882/pexels-photo-1394882.jpeg',
    price: 3150,
    inBag: false
  },
  {
    brand: 'Balmain',
    title: 'B-Bold low-top sneakers',
    image: 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg',
    price: 1100,
    inBag: true
  },
  {
    brand: 'Dior',
    title: 'Striped handbag',
    image: 'https://images.pexels.com/photos/12428342/pexels-photo-12428342.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 1980,
    inBag: false
  },
  {
    brand: 'Gucci',
    title: 'Monogram leather handbag',
    image: 'https://images.pexels.com/photos/27035625/pexels-photo-27035625/free-photo-of-a-woman-wearing-black-heels-and-holding-a-bag.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 2200,
    inBag: false
  }
];
toggleBag(item: any) {
  item.inBag = !item.inBag;
}

recentViews = [
  {
    brand: 'Fendi',
    title: 'Mini leather shoulder bag',
    image: 'https://images.pexels.com/photos/8801089/pexels-photo-8801089.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 1450,
    viewedOn: 'June 3, 2025'
  },
  {
    brand: 'Versace',
    title: 'Baroque Print Shirt',
    image: 'https://images.pexels.com/photos/32408965/pexels-photo-32408965/free-photo-of-stylish-man-in-vintage-floral-shirt-posing-indoors.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 890,
    viewedOn: 'June 3, 2025'
  },
  {
    brand: 'Chanel',
    title: 'Leather Flap Bag',
    image: 'https://images.pexels.com/photos/6538433/pexels-photo-6538433.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 3000,
    viewedOn: 'June 4, 2025'
  },
  {
    brand: 'Nike',
    title: 'Air Max 270',
    image: 'https://images.pexels.com/photos/4252970/pexels-photo-4252970.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 120,
    viewedOn: 'June 4, 2025'
  },
  {
    brand: 'Adidas',
    title: 'Ultraboost 22',
    image: 'https://images.pexels.com/photos/7394378/pexels-photo-7394378.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 140,
    viewedOn: 'June 5, 2025'
  },
  {
    brand: 'Burberry',
    title: 'Plaid Trench Coat',
    image: 'https://images.pexels.com/photos/4057673/pexels-photo-4057673.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 1850,
    viewedOn: 'June 5, 2025'
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

  checkout(order: any) {
    console.log('Checkout for:', order);
  }

  deleteOrder(order: any) {
    console.log('Delete order:', order);
  }
}




