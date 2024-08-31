import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../../account/services/account.service';
import { SharedService } from '../services/shared.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../models/account/user.model';

export const AuthorizationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const sharedService = inject(SharedService);
  const router = inject(Router);


  return accountService.user$.pipe(
    map((user: User | null) => {
      if (user) {
        return true;
      } else {
        sharedService.showNotification(false, 'Restricted Area', 'Leave immediately!');
        router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};
