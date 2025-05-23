import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Product } from '../models/product.interface';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule, NgIf, NgFor]
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  selectedImage: string = '';
  showPaymentForm: boolean = false;
  quantity: number = 1;

  private cartService = inject(CartService); 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe(product => {
      this.product = product;
      this.selectedImage = product.thumbnail || product.images[0];
    });
  }

  selectImage(color: string): void {
    const match = this.product.images.find(img => img.toLowerCase().includes(color));
    this.selectedImage = match || this.product.thumbnail;
  }

  addToCart(): void {
  const cartId = 1; 
  const productData = [{ id: this.product.id, quantity: this.quantity }];

  this.cartService.updateCart(cartId, productData).subscribe({
    next: (res) => {
      console.log('Cart updated:', res);
      alert(`${this.product.title} added to cart!`);
    },
    error: (err) => {
      console.error('Error updating cart:', err);
      alert('Failed to add to cart.');
    }
  });
}

  buyNow(): void {
    this.showPaymentForm = true;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
