import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Cart, CartProduct } from '../models/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  cart!: Cart;

  loading = false;

  ngOnInit(): void {
    // this.loading = true;
    
    // this.cartService.cart$.subscribe(cart => {
    //   if (cart) {
    //     this.cart = cart;
    //   }
    //   this.loading = false;
    // });

    // this.loadCart();
    this.loadCartFromLocalStorage();

  }

  loadCartFromLocalStorage(){
    this.loading = true;
    const storedCart = this.cartService.readCartFromStorage();
    console.log('storedCart', storedCart);
    
    if (storedCart != null) {
      this.loading = false;
      this.cart = storedCart;
    } else{
      this.loadCartFromAPI();
    }
  }

  loadCartFromAPI() {
    const authUser = this.authService.readAuthUserFromStorage();
    if (authUser != null) {

      this.cartService.getUserCart(authUser.id).subscribe({
        next: (res) => {
          if (res.carts && res.carts.length > 0) {
            this.cart = res.carts[0];
            this.cartService.saveCartToStorage(this.cart);
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });

    }
  }

  increaseQuantity(cartProduct: CartProduct) {
    cartProduct.quantity++;
    const authUser = this.authService.readAuthUserFromStorage();
    if (authUser) {
      this.cartService.updateCart(authUser.id, cartProduct.id, cartProduct.quantity).subscribe();
    }
  }

  decreaseQuantity(cartProduct: CartProduct) {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity--;
      const authUser = this.authService.readAuthUserFromStorage();
      if (authUser) {
        this.cartService.updateCart(authUser.id, cartProduct.id, cartProduct.quantity).subscribe();
      }
    }
  }

  deleteItem(index: number) {
    const productId = this.cart.products[index].id;
    const cartId = this.cart.id;
    this.cartService.deleteCartItem(cartId, productId).subscribe({
      next: () => {
        this.cart.products.splice(index, 1);
        this.cartService.saveCartToStorage(this.cart);
      },
      error: (err) => {
        console.error('Failed to delete item from cart:', err);
      }
    });
  }
}
