import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.interface';
import { ProductService } from '../services/product.service';
import { NgFor, NgIf } from '@angular/common';

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
  quantity: number =1;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

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
    console.log('Added to cart:', this.product);
    alert(`${this.product.title} added to cart!`);
  }

  buyNow(): void {
    this.showPaymentForm = true;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity():void {
    if ( this.quantity > 1) {
      this.quantity--;
    }
  }
}
