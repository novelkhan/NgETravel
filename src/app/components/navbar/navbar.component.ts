import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccountService } from 'src/app/modules/account/services/account.service';
import { CartService } from 'src/app/modules/cart/services/cart.service';
import { jwtDecode } from 'jwt-decode';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  collapsed = true;
  cartItemCount: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    public accountService: AccountService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cart item count subscribe করুন
    this.cartService.cartItemCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.cartItemCount = count;
      });

    // User login করলে cart count লোড করুন
    this.accountService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          const decodedToken: any = jwtDecode(user.jwt);
          console.log('User Roles:', decodedToken.role);
          
          // শুধুমাত্র Customer role থাকলে cart load করুন
          const userRoles = Array.isArray(decodedToken.role) 
            ? decodedToken.role 
            : [decodedToken.role];
          
          if (userRoles.includes('Customer') && !userRoles.includes('Admin')) {
            this.cartService.loadCartItemCount();
          } else {
            this.cartService.resetCartCount();
          }
        } else {
          console.log('No user logged in');
          this.cartService.resetCartCount();
        }
      });

    // Route change হলে mobile menu বন্ধ করুন
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.collapsed = true;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * চেক করে যে কোনো URL active আছে কিনা
   */
  isRouteActive(routes: string[]): boolean {
    return routes.some(route => this.router.url.includes(route));
  }

  /**
   * Customer dropdown এর কোনো route active আছে কিনা চেক করে
   */
  isCustomerDropdownActive(): boolean {
    return this.isRouteActive([ 
      '/customer/dashboard', 
      '/customer/profile',
      '/customer',
      '/orders'
    ]);
  }

  /**
   * Admin dropdown এর কোনো route active আছে কিনা চেক করে
   */
  isAdminDropdownActive(): boolean {
    return this.isRouteActive([
      '/admin', 
      '/admin/orders', 
      '/admin/order-details',
      '/packages/add-package', 
      '/packages/edit-package'
    ]);
  }

  logout() {
    this.accountService.logout(true);
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}