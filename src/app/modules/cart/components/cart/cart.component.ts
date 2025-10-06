import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from 'src/app/modules/order/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  selectedCartItems: any[] = [];

  constructor(private cartService: CartService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((data: any) => {
      this.cartItems = data;
    });
  }

  increaseQuantity(cartItemId: number): void {
    this.cartService.increaseQuantity(cartItemId).subscribe(() => {
      this.cartItems = this.cartItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, productQuantity: item.productQuantity + 1 } : item
      );
    });
  }

  decreaseQuantity(cartItemId: number): void {
    this.cartService.decreaseQuantity(cartItemId).subscribe(() => {
      this.cartItems = this.cartItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, productQuantity: item.productQuantity - 1 } : item
      );
    });
  }

  removeItemFromCart(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.cartItemId !== cartItemId);
      this.selectedCartItems = this.selectedCartItems.filter(selectedItem => selectedItem.cartItemId !== cartItemId);
    });
  }

  proceedToCheckout(): void {
    const selectedItemsId = this.selectedCartItems.length > 0
      ? this.selectedCartItems.map(item => item.cartItemId)
      : this.cartItems.map(item => item.cartItemId);

    this.orderService.cartCheckout(selectedItemsId).subscribe(() => {
      this.cartItems = [];
      this.selectedCartItems = [];
    });
  }

  toggleSelection(item: any, event: any): void {
    if (event.target.checked) {
      this.selectedCartItems.push(item);
    } else {
      this.selectedCartItems = this.selectedCartItems.filter(selectedItem => selectedItem.cartItemId !== item.cartItemId);
    }
  }

  isSelected(item: any): boolean {
    return this.selectedCartItems.some(selected => selected.cartItemId === item.cartItemId);
  }

  // নতুন ফাংশন: Total Items হিসাব করা
  getTotalItems(): number {
    const items = this.selectedCartItems.length > 0 ? this.selectedCartItems : this.cartItems;
    return items.reduce((total, item) => total + item.productQuantity, 0);
  }

  // নতুন ফাংশন: Total Price হিসাব করা
  getTotalPrice(): number {
    const items = this.selectedCartItems.length > 0 ? this.selectedCartItems : this.cartItems;
    return items.reduce((total, item) => total + (item.productPrice * item.productQuantity), 0);
  }
}