import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Cart } from '../models/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  getUserCart(): Observable<Cart> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    
    if (!token) {
        return throwError(() => new Error('No token found in localStorage'));
    }
    
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<Cart>(`${this.apiUrl}/cart/${userId}`);
  }

  updateCart(cartId: number, products: { id: number, quantity: number }[]): Observable<Cart> {
    const body = {
      merge: true,
      products: products
    };
    return this.http.put<Cart>(`${this.apiUrl}/carts/${cartId}`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
