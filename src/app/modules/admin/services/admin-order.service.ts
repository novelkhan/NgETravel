// src/app/modules/admin/services/admin-order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Order } from '../../shared/models/order/order.model';
import { OrderStatistics } from '../../shared/models/order/orderStatistics.model';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/api/AdminOrder/all-orders`);
  }

  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/api/AdminOrder/order-details/${orderId}`);
  }

  provideTicket(orderId: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/AdminOrder/provide-ticket/${orderId}`, {});
  }

  markAsCompleted(orderId: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/AdminOrder/mark-completed/${orderId}`, {});
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/AdminOrder/cancel-order/${orderId}`, {});
  }

  updateOrderStatus(orderId: number, orderStatus: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/AdminOrder/update-status/${orderId}`, { orderStatus });
  }

  updateAdminNotes(orderId: number, adminNotes: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/AdminOrder/update-notes/${orderId}`, { adminNotes });
  }

  getOrderStatistics(): Observable<OrderStatistics> {
    return this.http.get<OrderStatistics>(`${environment.apiUrl}/api/AdminOrder/statistics`);
  }
}