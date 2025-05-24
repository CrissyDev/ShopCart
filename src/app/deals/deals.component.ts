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

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res) => {
      this.flashDeals = res.products.slice(0, 6); 
    });
  }

  buyNow(product: Product) {
    alert(`Proceeding to buy: ${product.title}`);
  
  }
}
