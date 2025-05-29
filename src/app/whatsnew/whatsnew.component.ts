import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.interface';

@Component({
  selector: 'app-whats-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './whatsnew.component.html',
  styleUrls: ['./whatsnew.component.css']
})
export class WhatsNewComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  uniqueCategories: string[] = [];

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res) => {
      this.products = res.products.map(product => ({
        ...product,
        liked: false
      }));
      this.uniqueCategories = [...new Set(this.products.map(p => p.category))];
    });
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category);
  }

  toggleLike(product: Product): void {
    product.liked = !product.liked;
  }

  scrollLeft(category: string): void {
    const container = document.getElementById('slider-' + category);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(category: string): void {
    const container = document.getElementById('slider-' + category);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}
