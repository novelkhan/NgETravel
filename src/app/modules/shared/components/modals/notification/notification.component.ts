import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() isSuccess: boolean = true;
  @Input() title: string = '';
  @Input() message: string = '';

  constructor(private sharedService: SharedService) {}

  close() {
    this.sharedService.closeNotification();
  }
}