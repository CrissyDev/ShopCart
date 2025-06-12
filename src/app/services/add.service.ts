import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://dummyjson.com/carts/add';

  constructor(private http: HttpClient) {}

  updateCart(userId: number, products: { id: number; quantity: number }[]): Observable<any> {
    const body = {
      userId,
      products
    };
    return this.http.post(this.apiUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
