import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.interface';
import { SearchService } from '../services/search.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule],
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

  productTypes: string[] = [];
  selectedFilters: { [key: string]: string } = {};

  prices: string[] = ['Under $50', '$50 - $100', 'Above $100'];
  reviews: string[] = ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐'];
  closes: string[] = ['Open Back', 'Closed Back'];
  materials: string[] = ['plastic', 'metal', 'leather'];
  offers: string[] = ['10% Off', 'Buy 1 Get 1', 'Clearance Sale'];

  ngOnInit(): void {
    const allowedMaterials: ('plastic' | 'metal' | 'leather')[] = ['plastic', 'metal', 'leather'];

    this.productService.getProducts().subscribe((res) => {
      this.products = res.products.map(product => {
        const materialRaw = product.material?.toLowerCase();
        const material = allowedMaterials.includes(materialRaw as any)
          ? materialRaw as 'plastic' | 'metal' | 'leather'
          : 'plastic';

        return {
          ...product,
          liked: false,
          headphoneType: product.headphoneType ?? 'Over-Ear',
          closeType: product.closeType ?? 'Open Back',
          material,
          offer: product.offer ?? '10% Off',
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
        };
      });

      this.productTypes = Array.from(new Set(this.products.map(p => p.category)));
      this.filteredProducts = [...this.products];

      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedFilters['productType'] = params['category'];
        }
        this.applyFilters();
      });
    });

    this.searchService.search$.subscribe(term => {
      this.applyFilters(term);
    });
  }

  onFilterSelect(filterType: string, value: string) {
    this.selectedFilters[filterType] = value;
    this.applyFilters();
  }

  applyFilters(searchTerm: string = '') {
    this.filteredProducts = this.products.filter(product => {
      const matchesProductType = !this.selectedFilters['productType'] || product.category === this.selectedFilters['productType'];
      const matchesPrice = !this.selectedFilters['price'] || this.checkPrice(product.price, this.selectedFilters['price']);
      const matchesReview = !this.selectedFilters['review'] || this.checkReview(product.rating, this.selectedFilters['review']);
      const matchesCloseType = !this.selectedFilters['closeType'] || product.closeType === this.selectedFilters['closeType'];
      const matchesMaterial = !this.selectedFilters['material'] || product.material === this.selectedFilters['material'];
      const matchesOffer = !this.selectedFilters['offer'] || product.offer === this.selectedFilters['offer'];
      const matchesSearchTerm = !searchTerm || product.title.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesProductType &&
        matchesPrice &&
        matchesReview &&
        matchesCloseType &&
        matchesMaterial &&
        matchesOffer &&
        matchesSearchTerm
      );
    });

    this.updateVisibleProducts();
  }

  checkPrice(price: number, filter: string): boolean {
    switch (filter) {
      case 'Under $50': return price < 50;
      case '$50 - $100': return price >= 50 && price <= 100;
      case 'Above $100': return price > 100;
      default: return true;
    }
  }

  checkReview(rating: number, filter: string): boolean {
    const stars = filter.length;
    return rating >= stars && rating < stars + 1;
  }

  updateVisibleProducts() {
    this.visibleProducts = this.filteredProducts.slice(0, this.visibleCount);
  }

  seeMore() {
    this.visibleCount += 8;
    this.updateVisibleProducts();
  }

  seeLess() {
    this.visibleCount = 8;
    this.updateVisibleProducts();
  }

  productDetail(id: number) {
    this.router.navigate(['/product', id]);
  }

  toggleLike(product: Product) {
    product.liked = !product.liked;
  }

  resetProducts(){
    this.visibleProducts = [...this.products];
  }
}
