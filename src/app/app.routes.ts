import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path:'**',  component: PageNotFoundComponent},
    {path:'products' ,component:ProductListComponent,
    children:[
        {path: 'id' , component:ProductDetailsComponent}
    ]
},
    {path:'', redirectTo: '/products', pathMatch:'full'}
];