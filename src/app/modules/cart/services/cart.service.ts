import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Cart এ কতগুলো আইটেম আছে তা লোড করে
   */
  loadCartItemCount(): void {
    this.getCartItems().pipe(
      catchError(() => {
        // Error হলে count 0 করে দিন
        this.cartItemCountSubject.next(0);
        return of([]);
      })
    ).subscribe({
      next: (items: any[]) => {
        const totalCount = items.reduce((sum, item) => sum + item.productQuantity, 0);
        this.cartItemCountSubject.next(totalCount);
      }
    });
  }

  getCartItems(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/cart/cart-items`);
  }

  increaseQuantity(cartItemId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/cart/incre?cartItemId=${cartItemId}`).pipe(
      tap(() => this.loadCartItemCount())
    );
  }

  decreaseQuantity(cartItemId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/cart/decre?cartItemId=${cartItemId}`).pipe(
      tap(() => this.loadCartItemCount())
    );
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/cart/remove-from-cart?cartItemId=${cartItemId}`, {}).pipe(
      tap(() => this.loadCartItemCount())
    );
  }

  addToCart(packageId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/cart/add-to-cart?packageId=${packageId}`, {}).pipe(
      tap(() => this.loadCartItemCount())
    );
  }

  // Cart count reset করার জন্য
  resetCartCount(): void {
    this.cartItemCountSubject.next(0);
  }
}