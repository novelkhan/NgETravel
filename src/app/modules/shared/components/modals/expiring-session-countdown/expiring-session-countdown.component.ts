import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AccountService } from 'src/app/modules/account/services/account.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-expiring-session-countdown',
  templateUrl: './expiring-session-countdown.component.html',
  styleUrls: ['./expiring-session-countdown.component.scss']
})
export class ExpiringSessionCountdownComponent implements OnInit, OnDestroy {
  targetTime: number = 20; // Countdown time in seconds
  remainingTime: number = this.targetTime;
  displayTime: string = this.formatTime(this.remainingTime);
  countdownSubscription: Subscription | undefined;

  constructor(
    private accountService: AccountService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // Subscribe to the modalOpened$ Subject
    this.sharedService.modalOpened$.subscribe(() => {
      this.resetCountdown(); // Reset the countdown before starting
      this.startCountDown();
    });
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  resetCountdown() {
    this.remainingTime = this.targetTime; // Reset remainingTime to targetTime
    this.displayTime = this.formatTime(this.remainingTime); // Update displayTime
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
    });
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

  resumeSession() {
    this.closeModal();
    this.accountService.refreshToken();
  }
}