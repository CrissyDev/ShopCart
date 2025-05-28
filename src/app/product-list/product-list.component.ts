import { Component, inject, OnInit } from '@angular/core';
import { NgClass, NgIf, NgFor, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.interface';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  visibleProducts: Product[] = [];
  visibleCount: number = 8;

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

        this.updateVisibleProducts();
      });
    });

    this.searchService.search$.subscribe(term => {
      const lowerTerm = term.toLowerCase().trim();
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(lowerTerm) ||
        product.description.toLowerCase().includes(lowerTerm)
      );
      this.visibleCount = 8;
      this.updateVisibleProducts();
    });
  }

  toggleLike(product: Product): void {
    product.liked = !product.liked;
  }

  productDetail(id: number): void {
    this.router.navigate(['/product', id]);
  }

  seeMore(): void {
    this.visibleCount = this.filteredProducts.length;
    this.updateVisibleProducts();
  }

  seeLess(): void {
    this.visibleCount = 8;
    this.updateVisibleProducts();
  }

  private updateVisibleProducts(): void {
    this.visibleProducts = this.filteredProducts.slice(0, this.visibleCount);
  }
}
