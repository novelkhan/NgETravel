import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AccountService } from 'src/app/modules/account/services/account.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-expiring-session-countdown',
  templateUrl: './expiring-session-countdown.component.html',
  styleUrls: ['./expiring-session-countdown.component.scss']
})
export class ExpiringSessionCountdownComponent implements OnInit, OnDestroy {
  targetTime: number = 50; // Countdown time in seconds
  remainingTime: number = this.targetTime;
  displayTime: string = this.formatTime(this.remainingTime);
  countdownSubscription: Subscription | undefined;

  constructor(
    private accountService: AccountService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.startCountDown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  startCountDown() {
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.displayTime = this.formatTime(this.remainingTime);
      } else {
        this.stopCountdown();
        this.sharedService.showNotification(false, 'Logged Out', 'You have been logged out due to inactivity');
        this.logout();
      }
    })
  }

  private stopCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  logout() {
    this.closeModal();
    this.accountService.logout();
  }
  

  closeModal() {
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }



  /* resumeSession() {
    this.closeModal();
    this.accountService.refreshToken();
  } */


  resumeSession() {
    this.closeModal();
    this.accountService.refreshToken()
      .then(() => {
        // Reset the countdown after refreshing the token
        this.remainingTime = this.targetTime;
        this.displayTime = this.formatTime(this.remainingTime);
        this.startCountDown();
      })
      .catch((error) => {
        console.error('Failed to refresh token:', error);
        this.accountService.logout(); // Log the user out if the token refresh fails
      });
  }
}