import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  private productService = inject(ProductService);
  flashDeals: Product[] = [];
  startIndex = 0;

  ngOnInit(): void {
    this.loadFlashDeals();
  }

  loadFlashDeals(): void {
    this.productService.getProducts().subscribe((res) => {
      this.flashDeals = res.products.slice(0, 10);
    });
  }

  nextSlide(): void {
    if (this.startIndex + 5 < this.flashDeals.length) {
      this.startIndex++;
    }
  }

  prevSlide(): void {
    if (this.startIndex > 0) {
      this.startIndex--;
    }
  }

  addToCart(product: Product): void {
    alert(`${product.title} added to cart!`);
  }

  buyNow(product: Product): void {
    alert(`Buying ${product.title}`);
  }

  viewMore(): void {
    alert('Navigating to more products...');
  }
}
