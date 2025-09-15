import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AccountService } from 'src/app/modules/account/services/account.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-expiring-session-countdown',
  templateUrl: './expiring-session-countdown.component.html',
  styleUrls: ['./expiring-session-countdown.component.scss']
})
export class ExpiringSessionCountdownComponent implements OnInit, OnDestroy {
  targetTime: number = environment.countdownDurationInSeconds;
  remainingTime: number = this.targetTime;
  displayTime: string = this.formatTime(this.remainingTime);
  countdownSubscription: Subscription | undefined;

  constructor(
    private accountService: AccountService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.modalOpened$.subscribe((targetTime: number) => {
      this.targetTime = targetTime;
      this.resetCountdown();
      this.startCountDown();
    });
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  resetCountdown() {
    this.stopCountdown();
    this.remainingTime = this.targetTime;
    this.displayTime = this.formatTime(this.remainingTime);
  }

  startCountDown() {
    this.stopCountdown();
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.displayTime = this.formatTime(this.remainingTime);
      } else {
        this.stopCountdown();
        // ইন্যাকটিভিটির কারণে লগআউট, তাই নোটিফিকেশন দেখানো হবে
        this.sharedService.showNotification(false, 'Logged Out', 'You have been logged out due to inactivity');
        this.logout(false); // isManualLogout = false
      }
    });
  }

  private stopCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = undefined;
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

  logout(isManualLogout: boolean = false) {
    this.closeModal();
    this.accountService.logout(isManualLogout);
    this.stopCountdown();
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
    this.stopCountdown();
    this.resetCountdown();
    this.closeModal();
    this.accountService.refreshToken();
  }
}