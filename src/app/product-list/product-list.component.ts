import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgClass, RouterModule], 
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  
  products: Product[] = [];

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res) => {
      this.products = res.products.map(product => ({
        ...product,
        liked: false,
        headphoneType: 'Over-Ear',  
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)) 
      }));
    });
  }

  toggleLike(product: Product): void {
    product.liked = !product.liked;
  }
}
 