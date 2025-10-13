import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/modules/shared/models/order/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (orderId) {
      this.fetchOrderDetails(orderId);
    }
  }

  fetchOrderDetails(orderId: number): void {
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (response: Order) => {
        this.order = response;
      },
      error: (error) => {
        console.error('Failed to load order details:', error);
        alert('Failed to load order details. Please try again.');
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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