export interface OrderItem {
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  totalPrice: number;
}