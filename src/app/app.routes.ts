import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path:'products' ,component:ProductListComponent},
    {path: 'product/:id', component:ProductDetailComponent},
    {path:'home', redirectTo:''},
    {path:'**',  component: PageNotFoundComponent},
];