// src/app/modules/admin/components/admin-order-details/admin-order-details.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { Order } from 'src/app/modules/shared/models/order/order.model';

@Component({
  selector: 'app-admin-order-details',
  templateUrl: './admin-order-details.component.html',
  styleUrls: ['./admin-order-details.component.scss']
})
export class AdminOrderDetailsComponent implements OnInit {
  order: Order | null = null;
  adminNotes: string = '';
  selectedStatus: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminOrderService: AdminOrderService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (orderId) {
      this.loadOrderDetails(orderId);
    }
  }

  loadOrderDetails(orderId: number): void {
    this.loading = true;
    this.adminOrderService.getOrderDetails(orderId).subscribe({
      next: (response: Order) => {
        this.order = response;
        this.adminNotes = response.adminNotes || '';
        this.selectedStatus = response.orderStatus;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load order details:', error);
        this.sharedService.showNotification(false, 'Error', 'Failed to load order details');
        this.loading = false;
      }
    });
  }

  updateOrderStatus(): void {
    if (!this.order) return;

    this.adminOrderService.updateOrderStatus(this.order.orderId, this.selectedStatus).subscribe({
      next: (response) => {
        this.sharedService.showNotification(true, response.title, response.message);
        this.loadOrderDetails(this.order!.orderId);
      },
      error: (error) => {
        console.error('Failed to update status:', error);
        this.sharedService.showNotification(false, 'Error', 'Failed to update status');
      }
    });
  }

  updateAdminNotes(): void {
    if (!this.order) return;

    this.adminOrderService.updateAdminNotes(this.order.orderId, this.adminNotes).subscribe({
      next: (response) => {
        this.sharedService.showNotification(true, response.title, response.message);
        this.loadOrderDetails(this.order!.orderId);
      },
      error: (error) => {
        console.error('Failed to update notes:', error);
        this.sharedService.showNotification(false, 'Error', 'Failed to update notes');
      }
    });
  }

  provideTicket(): void {
    if (!this.order) return;

    if (confirm('আপনি কি নিশ্চিত যে এই অর্ডারের টিকেট প্রদান করতে চান?')) {
      this.adminOrderService.provideTicket(this.order.orderId).subscribe({
        next: (response) => {
          this.sharedService.showNotification(true, response.title, response.message);
          this.loadOrderDetails(this.order!.orderId);
        },
        error: (error) => {
          console.error('Failed to provide ticket:', error);
          this.sharedService.showNotification(false, 'Error', 'Failed to provide ticket');
        }
      });
    }
  }

  markAsCompleted(): void {
    if (!this.order) return;

    if (confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি সম্পন্ন হয়েছে?')) {
      this.adminOrderService.markAsCompleted(this.order.orderId).subscribe({
        next: (response) => {
          this.sharedService.showNotification(true, response.title, response.message);
          this.loadOrderDetails(this.order!.orderId);
        },
        error: (error) => {
          console.error('Failed to mark as completed:', error);
          this.sharedService.showNotification(false, 'Error', 'Failed to mark as completed');
        }
      });
    }
  }

  cancelOrder(): void {
    if (!this.order) return;

    if (confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান?')) {
      this.adminOrderService.cancelOrder(this.order.orderId).subscribe({
        next: (response) => {
          this.sharedService.showNotification(true, response.title, response.message);
          this.loadOrderDetails(this.order!.orderId);
        },
        error: (error) => {
          console.error('Failed to cancel order:', error);
          this.sharedService.showNotification(false, 'Error', 'Failed to cancel order');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
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