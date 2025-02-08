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
  targetTime: number = 5; // Default countdown time in seconds
  remainingTime: number = this.targetTime;
  displayTime: string = this.formatTime(this.remainingTime);
  countdownSubscription: Subscription | undefined;

  constructor(
    private accountService: AccountService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // Subscribe to the modalOpened$ Subject
    this.sharedService.modalOpened$.subscribe((targetTime: number) => {
      this.targetTime = targetTime; // Set the targetTime
      this.resetCountdown(); // Reset the countdown
      this.startCountDown(); // Start the countdown
    });
  }

  ngOnDestroy(): void {
    this.stopCountdown(); // Stop the countdown when the component is destroyed
  }

  resetCountdown() {
    this.stopCountdown(); // Stop the existing countdown
    this.remainingTime = this.targetTime; // Reset remainingTime to targetTime
    this.displayTime = this.formatTime(this.remainingTime); // Update displayTime
  }

  startCountDown() {
    this.stopCountdown(); // Stop the existing countdown before starting a new one
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
      this.countdownSubscription.unsubscribe(); // Unsubscribe to stop the countdown
      this.countdownSubscription = undefined; // Reset the subscription
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
    this.stopCountdown(); // Stop the current countdown
    this.resetCountdown(); // Reset the countdown
    this.closeModal();
    this.accountService.refreshToken();
  }
}