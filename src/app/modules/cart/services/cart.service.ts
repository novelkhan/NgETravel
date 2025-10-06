import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  getCartItems(): Observable<any> {
    return this.http.get('${environment.apiUrl}/api/cart/cart-items');
  }

  increaseQuantity(cartItemId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/cart/incre?cartItemId=${cartItemId}`);
  }

  decreaseQuantity(cartItemId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/cart/decre?cartItemId=${cartItemId}`);
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/cart/remove-from-cart?cartItemId=${cartItemId}`, {});
  }
}