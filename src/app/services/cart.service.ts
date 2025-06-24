import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Cart, CartResponse } from '../models/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://dummyjson.com';

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  private totalProductsSubject = new BehaviorSubject<number>(0);

  cart$ = this.cartSubject.asObservable();
  totalProducts$ = this.totalProductsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserCart(): Observable<CartResponse> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    if (!token || !userId) {
      return throwError(() => new Error('Missing token or user ID in localStorage'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<CartResponse>(`${this.apiUrl}/carts/user/${userId}`, { headers }).pipe(
      tap(response => {
        if (response?.carts?.length > 0) {
          const userCart = response.carts[0];
          this.cartSubject.next(userCart);
          this.totalProductsSubject.next(this.calculateTotalProducts(userCart));
        }
      }),
      catchError(error => {
        console.error('Failed to fetch user cart:', error);
        return throwError(() => new Error('Cart fetch failed'));
      })
    );
  }

  updateCart(cartId: number, products: { id: number; quantity: number }[]): Observable<Cart> {
    const body = {
      merge: true,
      products
    };

    return this.http.put<Cart>(`${this.apiUrl}/carts/${cartId}`, body, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.totalProductsSubject.next(this.calculateTotalProducts(cart));
      }),
      catchError(error => {
        console.error('Cart update failed:', error);
        return throwError(() => new Error('Cart update failed'));
      })
    );
  }

  deleteCartItem(cartId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carts/${cartId}/items/${productId}`).pipe(
      tap(() => {
        const currentCart = this.cartSubject.value;
        if (currentCart) {
          const updatedProducts = currentCart.products.filter(p => p.id !== productId);
          const updatedCart = { ...currentCart, products: updatedProducts };
          this.setCart(updatedCart);
        }
      }),
      catchError(error => {
        console.error('Failed to delete cart item:', error);
        return throwError(() => new Error('Delete cart item failed'));
      })
    );
  }

  setCart(cart: Cart): void {
    this.cartSubject.next(cart);
    this.totalProductsSubject.next(this.calculateTotalProducts(cart));
  }

  calculateTotalProducts(cart: Cart): number {
    return cart.products.reduce((acc, item) => acc + item.quantity, 0);
  }
}
