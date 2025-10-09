import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from 'src/app/modules/shared/models/order/order.model';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchOrderHistory();
  }

  fetchOrderHistory(): void {
    this.orderService.getOrderHistory().subscribe({
      next: (response: Order[]) => {
        this.orders = response.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      },
      error: (error) => {
        console.error('Error fetching order history:', error);
      }
    });
  }

  navigateToOrderDetails(orderId: number): void {
    this.router.navigate([`/orders/order-details/${orderId}`]);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}