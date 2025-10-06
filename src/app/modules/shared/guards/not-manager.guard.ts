// not-manager.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AccountService } from '../../account/services/account.service';
import { SharedService } from '../services/shared.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const NotManagerGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const sharedService = inject(SharedService);
  const router = inject(Router);

  return accountService.user$.pipe(
    map(user => {
      if (user) {
        const decodedToken: any = jwtDecode(user.jwt);
        if (decodedToken.role.includes('Manager')) {
          // ইউজারের "Manager" রোল আছে, তাই রিডিরেক্ট করব
          sharedService.showNotification(false, 'Restricted Area', 'Managers are not allowed here!');
          router.navigateByUrl('/');
          return false;
        }
        // ইউজারের "Manager" রোল নেই, তাই অ্যাক্সেস দেওয়া হবে
        return true;
      }


      sharedService.showNotification(false, 'Restricted Area', 'Please login to get access!');
      router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
      // ইউজার লগইন করা নেই, তাই অ্যাক্সেস দেওয়া হবে না।
      return false;
    })
  );
};