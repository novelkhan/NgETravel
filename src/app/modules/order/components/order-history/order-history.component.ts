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
        this.orders = response.sort((a, b) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
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
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Processing':
        return 'badge bg-warning text-dark';
      case 'TicketProvided':
        return 'badge bg-info text-white';
      case 'Completed':
        return 'badge bg-success';
      case 'Cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Processing':
        return 'প্রসেসিং';
      case 'TicketProvided':
        return 'টিকেট প্রদান করা হয়েছে';
      case 'Completed':
        return 'সম্পন্ন';
      case 'Cancelled':
        return 'বাতিল';
      default:
        return status;
    }
  }
}