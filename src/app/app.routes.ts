import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CategoriesComponent } from './categories/categories.component';
import { DealsComponent } from './deals/deals.component';
import { WhatsNewComponent } from './whatsnew/whatsnew.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component'; 
import { HelpcenterComponent } from './helpcenter/helpcenter.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AuthGuard } from './auth.guard';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '' },
  { path: 'login', component: LoginComponent }, 
  { path: 'categories', component: CategoriesComponent },
  { path: 'deals', component: DealsComponent },
  { path: 'new', component: WhatsNewComponent },
  { path: 'delivery', component: DeliveryComponent },
  { 
 path: 'account',
  loadComponent: () => import('./account/account.component').then(m => m.AccountComponent),
  canActivate: [AuthGuard]
   },
  { path: 'cart', component: CartComponent },
  {path: 'help-center', component: HelpcenterComponent},
  {path:'terms-of-service' , component:TermsOfServiceComponent},
  {path:'privacy-policy', component:PrivacyPolicyComponent},
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  {path:'checkout',component: CheckoutComponent },
  { path: '**', component: PageNotFoundComponent }
];
