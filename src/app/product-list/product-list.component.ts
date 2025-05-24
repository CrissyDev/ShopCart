import { Component, inject, OnInit } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.interface';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgClass, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  filteredProducts: Product[] = [];

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res) => {
      this.products = res.products.map(product => ({
        ...product,
        liked: false,
        headphoneType: 'Over-Ear',
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
      }));

      
      this.route.queryParams.subscribe(params => {
        const category = params['category'];
        if (category) {
          this.filteredProducts = this.products.filter(
            product => product.category.toLowerCase() === category.toLowerCase()
          );
        } else {
          this.filteredProducts = [...this.products];
        }
      });
    });

    this.searchService.search$.subscribe(term => {
      const lowerTerm = term.toLowerCase().trim();
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(lowerTerm) ||
        product.description.toLowerCase().includes(lowerTerm)
      );
    });
  }

  toggleLike(product: Product): void {
    product.liked = !product.liked;
  }
}
