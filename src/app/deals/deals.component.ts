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

  minutes: string = '60';
  seconds: string = '00';
  private intervalId: any;
  private flashDealDuration = 60 * 60; 
  private remainingSeconds = this.flashDealDuration;

  ngOnInit(): void {
    this.loadFlashDeals();
    this.startCountdown();
  }

  loadFlashDeals(): void {
    this.productService.getProducts().subscribe((res) => {
      const shuffled = res.products.sort(() => 0.5 - Math.random());
      this.flashDeals = shuffled.slice(0, 6);
    });
  }

  startCountdown(): void {
    this.intervalId = setInterval(() => {
      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = this.flashDealDuration;
        this.loadFlashDeals(); 
      } else {
        this.remainingSeconds--;
      }

      const mins = Math.floor(this.remainingSeconds / 60);
      const secs = this.remainingSeconds % 60;
      this.minutes = mins < 10 ? '0' + mins : '' + mins;
      this.seconds = secs < 10 ? '0' + secs : '' + secs;
    }, 1000);
  }

  addToCart(product: Product): void {
    alert(`${product.title} added to cart!`);
    
  }

  buyNow(product: Product): void {
    alert(`Proceeding to buy: ${product.title}`);
    
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
