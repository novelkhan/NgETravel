import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  displayingExpiringSessionModal = false;
  private notificationSubject = new Subject<{ isSuccess: boolean, title: string, message: string, callback?: () => void }>();
  notification$ = this.notificationSubject.asObservable();

  // Add a Subject to emit when the modal is opened
  private modalOpenedSubject = new Subject<void>();
  modalOpened$ = this.modalOpenedSubject.asObservable();

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
      document.body.classList.add('modal-open');
    }
  }

  openExpiringSessionCountdown() {
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
      // Emit the modalOpened event
      this.modalOpenedSubject.next();
    }
  }
}