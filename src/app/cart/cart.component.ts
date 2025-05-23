import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../models/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);

  cart!: Cart ;
  loading = true;

  ngOnInit(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        console.log('cart',res);
        
        
        this.cart = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch cart:', err);
        this.loading = false;
      }
    });
  }
}
