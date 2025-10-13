import { OrderItem } from "./orderItem.model";

export interface Order {
  orderId: number;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderDate: string;
  totalAmount: number;
  isPaid: boolean;
  orderStatus: string;
  isTicketProvided: boolean;
  ticketProvidedDate?: string;
  isCompleted: boolean;
  completedDate?: string;
  adminNotes?: string;
  totalItems?: number;
  orderItems: OrderItem[];
}