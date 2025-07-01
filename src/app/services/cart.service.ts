import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { Cart, CartResponse, CartProduct } from '../models/cart.interface';
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

  private lastDeletedItem: { product: CartProduct, index: number } | null = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Missing token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addToCart(userId: number, product: CartProduct): Observable<Cart> {
    const url = `${this.apiUrl}/users/${userId}/cart`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(url, product, { headers }).pipe(
      switchMap(() => this.getUserCart(userId)),
      map(response => this.transformCartResponseToCart(response)),
      tap(cart => this.setCart(cart)),
      catchError(error => {
        console.error('Failed to add to cart:', error);
        return throwError(() => new Error('Add to cart failed'));
      })
    );
  }

  getUserCart(user_id: any): Observable<CartResponse> {
    console.log(`Fetching cart for user id: ${user_id}`);
    return this.http.get<CartResponse>(`${this.apiUrl}/carts/user/${user_id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => console.log('CartService.getUserCart response:', res)),
      catchError(error => {
        console.error('CartService.getUserCart error:', error);
        return throwError(() => new Error('Failed to get user cart'));
      })
    );
  }

  updateCart(userId: number, product_id: number, product_quantity: number): Observable<Cart> {
    const product = { id: product_id, quantity: product_quantity };
    const body = {
      merge: true,
      products: [product]
    };

    return this.http.put<Cart>(`${this.apiUrl}/carts/${userId}`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(cart => this.setCart(cart)),
      catchError(error => {
        console.error('Cart update failed:', error);
        return throwError(() => new Error('Cart update failed'));
      })
    );
  }

  deleteCartItem(cartId: number, productId: number): Observable<any> {
    const url = `${this.apiUrl}/carts/${cartId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(url, { headers }).pipe(
      switchMap((cart: any) => {
        const index = cart.products.findIndex((p: any) => p.id === productId);
        if (index === -1) return throwError(() => new Error('Product not found in cart'));

        this.lastDeletedItem = {
          product: cart.products[index],
          index
        };

        const updatedProducts = cart.products.filter((p: any) => p.id !== productId);
        const updatedCart = { ...cart, products: updatedProducts };
        return this.http.put<any>(url, updatedCart, { headers });
      }),
      catchError(error => {
        console.error('Failed to delete cart item:', error);
        return throwError(() => new Error('Delete cart item failed'));
      })
    );
  }

  restoreLastDeletedItem(cartId: number): Observable<any> {
    if (!this.lastDeletedItem) return throwError(() => new Error('No deleted item to restore'));

    const url = `${this.apiUrl}/carts/${cartId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(url, { headers }).pipe(
      switchMap((cart: any) => {
        const updatedProducts = [...cart.products];
        updatedProducts.splice(this.lastDeletedItem!.index, 0, this.lastDeletedItem!.product);

        const updatedCart = { ...cart, products: updatedProducts };
        return this.http.put<any>(url, updatedCart, { headers }).pipe(
          tap(() => this.lastDeletedItem = null)
        );
      }),
      catchError(error => {
        console.error('Failed to restore deleted item:', error);
        return throwError(() => new Error('Restore failed'));
      })
    );
  }

  setCart(cart: Cart): void {
    this.saveCartToStorage(cart);
    this.cartSubject.next(cart);
    this.totalProductsSubject.next(this.calculateTotalProducts(cart));
  }

  calculateTotalProducts(cart: Cart): number {
    return cart.products.reduce((acc, item) => acc + item.quantity, 0);
  }

  recalculateCartTotals(products: CartProduct[]): Partial<Cart> {
    let total = 0;
    let totalQuantity = 0;

    products.forEach(item => {
      item.total = item.price * item.quantity;
      total += item.total;
      totalQuantity += item.quantity;
    });

    return {
      total,
      discountedTotal: total * 0.9,
      totalProducts: totalQuantity
    };
  }

  saveCartToStorage(cart: Cart) {
    console.log('Saving cart to storage:', cart);
    localStorage.setItem('userCart', JSON.stringify(cart));
  }

  readCartFromStorage(): Cart | null {
    let storedCart = localStorage.getItem('userCart');
    return storedCart ? JSON.parse(storedCart) : null;
  }

  private transformCartResponseToCart(response: CartResponse): Cart {
    const cart = response.carts?.[0];
    if (!cart) throw new Error('Cart not found in response');
    return cart;
  }

  
  clearCart(): void {
    this.cartSubject.next(null);
    this.totalProductsSubject.next(0);
    localStorage.removeItem('userCart');
  }
}
