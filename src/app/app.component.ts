import { Component, HostListener, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AccountService } from './modules/account/services/account.service';
import { User } from './modules/shared/models/account/user.model';
import { SharedService } from './modules/shared/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private accountService: AccountService,
    private sharedService: SharedService) {}

  ngOnInit(): void {
    this.refreshUser();
  }

  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          clearTimeout(this.accountService.timeoutId);
          this.accountService.checkUserIdleTimout();
        }
      }
    })
  }

  private refreshUser() {
    const jwt = this.accountService.getJWT();
    if (jwt) {
      this.accountService.refreshUser(jwt).subscribe({
        next: _ => {},
        error: error => {
          this.accountService.logout();

          if (error.status === 401) {
            this.sharedService.showNotification(false, 'Account blocked', error.error);
          }
        }
      })
    } else {
      this.accountService.refreshUser(null).subscribe();
    }
  }
}