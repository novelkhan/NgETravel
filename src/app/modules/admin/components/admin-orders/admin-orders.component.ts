// src/app/modules/admin/components/admin-orders/admin-orders.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { OrderStatistics } from 'src/app/modules/shared/models/order/orderStatistics.model';
import { Order } from 'src/app/modules/shared/models/order/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statistics: OrderStatistics | null = null;
  selectedFilter: string = 'All';
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private adminOrderService: AdminOrderService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadStatistics();
  }

  /**
   * Load all orders from backend
   */
  loadOrders(): void {
    this.loading = true;
    this.adminOrderService.getAllOrders().subscribe({
      next: (response: Order[]) => {
        this.orders = response;
        this.filteredOrders = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
        this.sharedService.showNotification(false, 'Error', 'Failed to load orders');
        this.loading = false;
      }
    });
  }

  /**
   * Load order statistics
   */
  loadStatistics(): void {
    this.adminOrderService.getOrderStatistics().subscribe({
      next: (response: OrderStatistics) => {
        this.statistics = response;
      },
      error: (error) => {
        console.error('Failed to load statistics:', error);
      }
    });
  }

  /**
   * Filter orders by status
   */
  filterOrders(status: string): void {
    this.selectedFilter = status;
    if (status === 'All') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.orderStatus === status);
    }
  }

  /**
   * Search orders by ID, customer name or email
   */
  searchOrders(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredOrders = this.orders;
      return;
    }
    
    this.filteredOrders = this.orders.filter(order =>
      order.orderId.toString().includes(term) ||
      order.customerName?.toLowerCase().includes(term) ||
      order.customerEmail?.toLowerCase().includes(term)
    );
  }

  /**
   * Provide ticket for an order
   */
  provideTicket(orderId: number): void {
    if (confirm('আপনি কি নিশ্চিত যে এই অর্ডারের টিকেট প্রদান করতে চান?')) {
      this.adminOrderService.provideTicket(orderId).subscribe({
        next: (response) => {
          this.sharedService.showNotification(true, response.title, response.message);
          this.loadOrders();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Failed to provide ticket:', error);
          this.sharedService.showNotification(false, 'Error', 'Failed to provide ticket');
        }
      });
    }
  }

  /**
   * Mark order as completed
   */
  markAsCompleted(orderId: number): void {
    if (confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি সম্পন্ন হয়েছে?')) {
      this.adminOrderService.markAsCompleted(orderId).subscribe({
        next: (response) => {
          this.sharedService.showNotification(true, response.title, response.message);
          this.loadOrders();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Failed to mark as completed:', error);
          this.sharedService.showNotification(false, 'Error', 'Failed to mark as completed');
        }
      });
    }
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: number): void {
    if (confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান?')) {
      this.adminOrderService.cancelOrder(orderId).subscribe({
        next: (response) => {
          this.sharedService.showNotification(true, response.title, response.message);
          this.loadOrders();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Failed to cancel order:', error);
          this.sharedService.showNotification(false, 'Error', 'Failed to cancel order');
        }
      });
    }
  }

  /**
   * Navigate to order details page
   */
  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/admin/order-details', orderId]);
  }

  /**
   * Format date to Bengali locale
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Get badge class based on order status
   */
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

  /**
   * Get status text in Bengali
   */
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