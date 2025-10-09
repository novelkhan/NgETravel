import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { NotificationComponent } from './components/modals/notification/notification.component';
import { ExpiringSessionCountdownComponent } from './components/modals/expiring-session-countdown/expiring-session-countdown.component';
import { UserHasRoleDirective } from './directives/user-has-role.directive';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserHasNotRoleDirective } from './directives/user-has-not-role.directive';



@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificationComponent,
    ExpiringSessionCountdownComponent,
    UserHasRoleDirective,
    UserHasNotRoleDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessagesComponent,
    UserHasRoleDirective,
    UserHasNotRoleDirective,
    NotificationComponent,
    ExpiringSessionCountdownComponent
  ]
})
export class SharedModule { }