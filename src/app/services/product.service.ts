import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductsResponse } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private getProductsUrl = environment.apiUrl + '/products';

  
  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.getProductsUrl);
  }

  
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.getProductsUrl}/${id}`);
  }
}
