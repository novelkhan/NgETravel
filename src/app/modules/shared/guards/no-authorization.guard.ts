import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../../account/services/account.service';
import { SharedService } from '../services/shared.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../models/account/user.model';

export const NoAuthorizationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const sharedService = inject(SharedService);
  const router = inject(Router);

  return accountService.user$.pipe(
    map((user: User | null) => {
      if (!user) {
        // ইউজার লগইন করা নেই, তাই রাউটে অ্যাক্সেস দেওয়া হবে
        return true;
      } else {
        // ইউজার লগইন করা আছে, তাই হোম পেজে রিডিরেক্ট করা হবে
        sharedService.showNotification(false, 'Access Denied', 'You are already logged in!');
        router.navigate(['/']); // হোম পেজে রিডিরেক্ট (অথবা আপনার পছন্দমতো রাউট)
        return false;
      }
    })
  );
};