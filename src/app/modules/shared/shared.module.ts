import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { NotificationComponent } from './components/modals/notification/notification.component';



@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
