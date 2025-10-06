import { OrderItem } from "./orderItem.model";

export interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  isShipped: boolean;
  orderItems: OrderItem[];
}