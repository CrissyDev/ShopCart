import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private updateCartUrl = environment.apiUrl + '/carts/add';

  constructor(private http: HttpClient) {}

  updateCart(userId: number, products: { id: number; quantity: number }[]): Observable<any> {
    const body = {
      userId,
      products
    };
    return this.http.post(this.updateCartUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
