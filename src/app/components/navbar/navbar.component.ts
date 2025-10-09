import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/modules/account/services/account.service';
import { CartService } from 'src/app/modules/cart/services/cart.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  collapsed = true;
  cartItemCount: number = 0;

  constructor(
    public accountService: AccountService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    // Cart item count subscribe করুন
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });

    // User login করলে cart count লোড করুন এবং role check করুন
    this.accountService.user$.subscribe(user => {
      if (user) {
        const decodedToken: any = jwtDecode(user.jwt);
        console.log('User Roles:', decodedToken.role); // ডিবাগিং এর জন্য
        this.cartService.loadCartItemCount();
      } else {
        console.log('No user logged in'); // ডিবাগিং এর জন্য
        this.cartItemCount = 0;
      }
    });
  }

  logout() {
    this.accountService.logout(true);
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}