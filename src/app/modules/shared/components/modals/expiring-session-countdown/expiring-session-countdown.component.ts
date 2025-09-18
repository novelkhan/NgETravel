import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AccountService } from 'src/app/modules/account/services/account.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { User } from '../../../models/account/user.model';

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
  private userSubscription: Subscription | undefined; // নতুন: user চেকের জন্য

  constructor(
    private accountService: AccountService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // নতুন: user$ subscribe করে চেক করুন যে user null হলে কাউন্টডাউন থামান
    this.userSubscription = this.accountService.user$.subscribe((user: User | null) => {
      if (!user) {
        this.stopCountdown();
        this.closeModal();
      }
    });

    // বিদ্যমান modalOpened$ subscribe
    this.sharedService.modalOpened$.subscribe((targetTime: number) => {
      this.targetTime = targetTime;
      if (targetTime > 0) { // যদি 0 হয় (close signal), কাউন্টডাউন না শুরু করুন
        this.resetCountdown();
        this.startCountDown();
      } else {
        this.stopCountdown();
        this.closeModal();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCountdown();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
    this.stopCountdown(); // ইতিমধ্যে আছে, কিন্তু নিশ্চিত করার জন্য
    this.accountService.logout(isManualLogout);
    // অতিরিক্ত: shared service দিয়ে modal close
    this.sharedService.closeExpiringSessionModal();
  }

  closeModal() {
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      // ⚡ প্রথমে ফোকাস রিসেট করুন
      (document.activeElement as HTMLElement)?.blur();
      document.body.focus(); // ✅ Extra safe fallback

      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true'); // ✅ FIX
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