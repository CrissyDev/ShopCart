import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Cart, CartResponse } from '../models/cart.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  private totalProductsSubject = new BehaviorSubject<number>(0);

  cart$ = this.cartSubject.asObservable();
  totalProducts$ = this.totalProductsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Missing token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserCart(user_id: any): Observable<CartResponse> {
    
    return this.http.get<CartResponse>(`${this.apiUrl}/carts/user/${user_id}`, { headers: this.getAuthHeaders() }).pipe(
      // tap(response => {
      //   if (response?.carts?.length > 0) {
      //     const userCart = response.carts[0];
      //     this.cartSubject.next(userCart);
      //     this.totalProductsSubject.next(this.calculateTotalProducts(userCart));
      //   } else {
      //     this.cartSubject.next(null);
      //     this.totalProductsSubject.next(0);
      //   }
      // }),
      // catchError(error => {
      //   console.error('Failed to fetch user cart:', error);
      //   return throwError(() => new Error('Cart fetch failed'));
      // })
    );
  }

  updateCart(userId: number, product_id: number, product_quantity: number): Observable<Cart> {
    const product = { id: product_id, quantity: product_quantity };
    const body = {
      merge: true,
      products: [product]
    };

    return this.http.put<Cart>(`${this.apiUrl}/carts/${userId}`, body, { headers: this.getAuthHeaders() }).pipe(
      tap(cart => {
        this.setCart(cart);
      }),
      catchError(error => {
        console.error('Cart update failed:', error);
        return throwError(() => new Error('Cart update failed'));
      })
    );
  }

  deleteCartItem(cartId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carts/${cartId}/items/${productId}`, { headers: this.getAuthHeaders() }).pipe(
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
    this.saveCartToStorage(cart);
  }

  calculateTotalProducts(cart: Cart): number {
    return cart.products.reduce((acc, item) => acc + item.quantity, 0);
  }

  saveCartToStorage(cart: Cart) {
    localStorage.setItem('userCart', JSON.stringify(cart));
  }

  readCartFromStorage(): Cart | null {
    const storedCart = localStorage.getItem('userCart');
    if (storedCart) {
      try {
        return JSON.parse(storedCart);
      } catch {
        return null;
      }
    } 
    return null;
  }
}
