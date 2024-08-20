import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { LoginComponent } from './components/login/login.component';


@NgModule({
  declarations: [
    ConfirmEmailComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
