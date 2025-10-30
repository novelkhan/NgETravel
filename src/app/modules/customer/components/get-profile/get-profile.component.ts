import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { AccountService } from 'src/app/modules/account/services/account.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-profile',
  templateUrl: './get-profile.component.html',
  styleUrls: ['./get-profile.component.scss']
})
export class GetProfileComponent  implements OnInit {
  profile: any = null;
  loading: boolean = false;
  statistics: any = {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: 0
  };

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadStatistics();
  }

  loadProfile() {
    this.loading = true;
    this.customerService.getProfile().subscribe({
      next: (response: any) => {
        this.profile = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.sharedService.showNotification(false, 'Error', 'Failed to load profile');
        this.loading = false;
      }
    });
  }

  loadStatistics() {
    // This would come from an API in real scenario
    // For now, we'll use placeholder data
    this.statistics = {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      totalSpent: 0
    };
  }

  navigateToEdit() {
    this.router.navigate(['/customer/dashboard']);
  }

  navigateToOrders() {
    this.router.navigate(['/orders']);
  }

  navigateToPackages() {
    this.router.navigate(['/packages']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAccountAge(): string {
    if (!this.profile?.dateCreated) return '0 days';
    
    const created = new Date(this.profile.dateCreated);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }

  logout() {
    this.accountService.logout();
  }
}