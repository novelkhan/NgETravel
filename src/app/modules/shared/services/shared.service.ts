import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  displayingExpiringSessionModal = false;
  private notificationSubject = new Subject<{ isSuccess: boolean, title: string, message: string, callback?: () => void }>();
  notification$ = this.notificationSubject.asObservable();

  private modalOpenedSubject = new Subject<number>();
  modalOpened$ = this.modalOpenedSubject.asObservable();

  private focusTrapHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor() {}

  showNotification(isSuccess: boolean, title: string, message: string, callback?: () => void) {
    this.notificationSubject.next({ isSuccess, title, message, callback });
    this.openNotificationModal();
  }

  private openNotificationModal() {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      this.trapFocus(modalElement);
    }
  }

  openExpiringSessionCountdown(targetTime: number = 5) {
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      this.trapFocus(modalElement);

      this.modalOpenedSubject.next(targetTime);
    }
  }

  closeExpiringSessionModal() {
    this.displayingExpiringSessionModal = false;
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      (document.activeElement as HTMLElement)?.blur();
      document.body.focus();

      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      this.releaseFocusTrap();
    }
    this.modalOpenedSubject.next(0);
  }

  // ✅ Focus Trap Function
  private trapFocus(modalElement: HTMLElement) {
    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
      'input:not([disabled])', 'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    const focusableEls = Array.from(modalElement.querySelectorAll<HTMLElement>(focusableSelectors.join(',')));
    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    // প্রথম element-এ ফোকাস দিন
    firstEl.focus();

    this.focusTrapHandler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab → প্রথম element থেকে গেলে শেষ element-এ যান
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          // শুধু Tab → শেষ element থেকে গেলে প্রথম element-এ যান
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', this.focusTrapHandler);
  }

  private releaseFocusTrap() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }
}