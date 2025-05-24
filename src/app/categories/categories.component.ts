import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  private productService = inject(ProductService);

  categories: { name: string; count: number; image: string }[] = [];

  categoryImages: { [key: string]: string } = {
    beauty: 'https://images.pexels.com/photos/3373743/pexels-photo-3373743.jpeg',
    furniture: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
    fragrances: 'https://images.pexels.com/photos/965991/pexels-photo-965991.jpeg?auto=compress&cs=tinysrgb&w=600',
    groceries: 'https://images.pexels.com/photos/7879964/pexels-photo-7879964.jpeg?auto=compress&cs=tinysrgb&w=600',
    //include more categories here
    // bag: 'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg',
    // laptop: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    // book: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg'
  };

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        const grouped = res.products.reduce((acc: Record<string, Product[]>, product: Product) => {
          const categoryKey = product.category.toLowerCase();
          if (!acc[categoryKey]) {
            acc[categoryKey] = [];
          }
          acc[categoryKey].push(product);
          return acc;
        }, {});

        this.categories = Object.entries(grouped).map(([name, items]) => {
          return {
            name,
            count: items.length,
            image: this.categoryImages[name] || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
          };
        });
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      }
    });
  }
}
