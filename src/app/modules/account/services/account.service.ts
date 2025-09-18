import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { map, of, ReplaySubject, take } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../../shared/models/account/user.model';
import { ResetPassword } from '../../shared/models/account/resetPassword.model';
import { ConfirmEmail } from '../../shared/models/account/confirmEmail.model';
import { Register } from '../../shared/models/account/register.model';
import { Login } from '../../shared/models/account/login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../shared/services/shared.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  private refreshTokenTimeout: any;
  private timeoutId: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {}

  /** ------------------------------
   * 🔹 AUTH ACTIONS
   * ------------------------------ */

  login(model: Login) {
    return this.http.post<User>(
      `${environment.apiUrl}/api/account/login`,
      model,
      { withCredentials: true }
    ).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  logout(isManualLogout: boolean = false) {
    // 1. Idle timer clear
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // 2. Refresh timer clear
    this.stopRefreshTokenTimer();

    // 3. Session modal বন্ধ
    this.sharedService.closeExpiringSessionModal();

    // 4. LocalStorage clear
    localStorage.removeItem(environment.userKey);

    // 5. User null করা
    this.userSource.next(null);

    // 6. Route redirect
    this.router.navigateByUrl('/');
  }

  register(model: Register) {
    return this.http.post(
      `${environment.apiUrl}/api/account/register`,
      model,
      { withCredentials: true }
    );
  }

  confirmEmail(model: ConfirmEmail) {
    return this.http.put(
      `${environment.apiUrl}/api/account/confirm-email`,
      model,
      { withCredentials: true }
    );
  }

  resendEmailConfirmationLink(email: string) {
    return this.http.post(
      `${environment.apiUrl}/api/account/resend-email-confirmation-link/${email}`,
      {},
      { withCredentials: true }
    );
  }

  forgotUsernameOrPassword(email: string) {
    return this.http.post(
      `${environment.apiUrl}/api/account/forgot-username-or-password/${email}`,
      {},
      { withCredentials: true }
    );
  }

  resetPassword(model: ResetPassword) {
    return this.http.put(
      `${environment.apiUrl}/api/account/reset-password`,
      model,
      { withCredentials: true }
    );
  }

  /** ------------------------------
   * 🔹 REFRESH TOKEN
   * ------------------------------ */

  refreshToken = () => {
    this.http.post<User>(
      `${environment.apiUrl}/api/account/refresh-token`,
      {},
      { withCredentials: true }
    ).subscribe({
      next: (user: User) => {
        if (user) {
          this.setUser(user);
        }
      },
      error: (error) => this.handleHttpError(error, 'Token Refresh Failed')
    });
  }

  refreshUser(jwt: string | null) {
    if (!jwt) {
      this.userSource.next(null);
      return of(undefined);
    }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + jwt);

    return this.http.get<User>(
      `${environment.apiUrl}/api/account/refresh-page`,
      { headers, withCredentials: true }
    ).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  /** ------------------------------
   * 🔹 USER STATE & TOKEN HANDLING
   * ------------------------------ */

  private setUser(user: User) {
    // LocalStorage update
    localStorage.setItem(environment.userKey, JSON.stringify(user));

    // Rx state update
    this.userSource.next(user);

    // Session modal flag reset
    this.sharedService.displayingExpiringSessionModal = false;

    // Refresh timer reset
    this.stopRefreshTokenTimer();
    this.startRefreshTokenTimer(user.jwt);

    // Idle timeout reset
    this.checkUserIdleTimout();
  }

  getJWT() {
    const key = localStorage.getItem(environment.userKey);
    if (!key) return null;

    const user: User = JSON.parse(key);
    return user.jwt;
  }

  /** ------------------------------
   * 🔹 TOKEN TIMERS
   * ------------------------------ */

  private startRefreshTokenTimer(jwt: string) {
    const decodedToken: any = jwtDecode(jwt);
    const expires = new Date(decodedToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (30 * 1000);
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  /** ------------------------------
   * 🔹 IDLE TIMEOUT
   * ------------------------------ */
  checkUserIdleTimout() {
    this.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user && !this.sharedService.displayingExpiringSessionModal) {
          this.timeoutId = setTimeout(() => {
            this.sharedService.displayingExpiringSessionModal = true;
            this.sharedService.openExpiringSessionCountdown(
              environment.countdownDurationInSeconds
            );
          }, environment.idleTimeoutInMilliSeconds);
        }
      }
    });
  }

  /** ------------------------------
   * 🔹 ERROR HANDLER (Reusable)
   * ------------------------------ */
  private handleHttpError(error: any, fallbackTitle: string = 'Error') {
    const message =
      (error?.error && typeof error.error === 'string')
        ? error.error
        : 'An unexpected error occurred. Please try again.';

    this.sharedService.showNotification(false, fallbackTitle, message);
    this.logout(); // force logout on major failure
  }

  clearIdleTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}