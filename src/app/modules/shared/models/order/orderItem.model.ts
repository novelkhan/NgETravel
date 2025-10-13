export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  productImage?: any;
  quantity: number;
  perUnitPrice: number;
  totalPrice: number;
}