import { Component } from '@angular/core';
import { HeroComponent } from "../hero/hero.component";
import { ProductListComponent } from "../product-list/product-list.component";

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    ProductListComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
