import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone:true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  bannerImage: string = 'public/images/shop.jpg'; 
}