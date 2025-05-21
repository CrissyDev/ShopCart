import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CategoriesComponent } from './categories/categories.component';
import { DealsComponent } from './deals/deals.component';
import { WhatsnewComponent } from './whatsnew/whatsnew.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { AccountComponent } from './account/account.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '' },
  { path: 'login', component: LoginComponent }, 
  { path: 'categories', component: CategoriesComponent },
  { path: 'deals', component: DealsComponent },
  { path: 'new', component: WhatsnewComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'account', component: AccountComponent },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: '**', component: PageNotFoundComponent }
];
