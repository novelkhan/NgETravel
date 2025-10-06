import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  cartCheckout(selectedCartItems: number[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/order/cart-checkout`, selectedCartItems);
  }

  singleCheckout(packageId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/order/single-checkout`, packageId);
  }

  getOrderHistory(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/order/order-history`, {});
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/order/order-details/${orderId}`);
  }
}