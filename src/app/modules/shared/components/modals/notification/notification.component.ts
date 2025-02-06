import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  isSuccess: boolean = true;
  title: string = '';
  message: string = '';
  private callback?: () => void;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.notification$.subscribe(notification => {
      this.isSuccess = notification.isSuccess;
      this.title = notification.title;
      this.message = notification.message;
      this.callback = notification.callback;
    });
  }

  closeModal() {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');

      // Execute the callback if it exists
      if (this.callback) {
        this.callback();
      }
    }
  }
}