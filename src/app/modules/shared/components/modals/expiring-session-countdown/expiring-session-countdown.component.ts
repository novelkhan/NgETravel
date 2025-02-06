import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-expiring-session-countdown',
  templateUrl: './expiring-session-countdown.component.html',
  styleUrls: ['./expiring-session-countdown.component.scss']
})
export class ExpiringSessionCountdownComponent implements OnInit, OnDestroy {
  @Input() targetTime: number = 120;
  remainingTime: number = 0;
  displayTime: string = '';
  private countdownSubscription?: Subscription;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.remainingTime = this.targetTime;
    this.updateDisplayTime();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  private startCountdown() {
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.updateDisplayTime();
      } else {
        this.stopCountdown();
        this.sharedService.closeSessionCountdown();
        alert('You have been logged out due to inactivity.');
      }
    });
  }

  private stopCountdown() {
    this.countdownSubscription?.unsubscribe();
  }

  private updateDisplayTime() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.displayTime = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  logout() {
    this.sharedService.closeSessionCountdown();
    alert('You have been logged out.');
  }

  resumeSession() {
    this.sharedService.closeSessionCountdown();
    alert('Session resumed.');
  }
}