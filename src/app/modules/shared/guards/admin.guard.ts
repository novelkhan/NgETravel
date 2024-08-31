import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AccountService } from '../../account/services/account.service';
import { SharedService } from '../services/shared.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const AdminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const sharedService = inject(SharedService);
  const router = inject(Router);

  return accountService.user$.pipe(
    map(user => {
      if (user) {
        const decodedToken:any = jwtDecode(user.jwt);
        if (decodedToken.role.includes('Admin')) {
          return true;
        }
      }

      sharedService.showNotification(false, 'Admin Area', 'Leave now!');
      router.navigateByUrl('/');
      return false;
    })
  );
};
