import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>('https://dummyjson.com/products');
  }

}