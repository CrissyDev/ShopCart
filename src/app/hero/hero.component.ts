import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  dropdowns: { [key: string]: boolean } = {};

  toggleDropdown(selection: string): void {
    this.dropdowns[selection] = !this.dropdowns[selection];
  }
}

export interface Product {
  type: string;
  price: number;
  review: number;
  close: string;
  material: string;
  offer: string;
}
