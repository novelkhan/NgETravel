import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from 'src/app/modules/order/services/order.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  selectedCartItems: any[] = [];

  constructor(
    private cartService: CartService, 
    private orderService: OrderService,
    private sharedService: SharedService,
    private router: Router
  ) {}

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

    this.orderService.cartCheckout(selectedItemsId).subscribe({
      next: (response) => {
        this.cartItems = [];
        this.selectedCartItems = [];
        this.sharedService.showNotification(true, 'Success', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
        // Order History পেজে রিডাইরেক্ট
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('অর্ডার করতে সমস্যা হয়েছে:', error);
        this.sharedService.showNotification(false, 'Error', 'অর্ডার করতে ব্যর্থ হয়েছে।');
      }
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

  getTotalItems(): number {
    const items = this.selectedCartItems.length > 0 ? this.selectedCartItems : this.cartItems;
    return items.reduce((total, item) => total + item.productQuantity, 0);
  }

  getTotalPrice(): number {
    const items = this.selectedCartItems.length > 0 ? this.selectedCartItems : this.cartItems;
    return items.reduce((total, item) => total + (item.productPrice * item.productQuantity), 0);
  }
}