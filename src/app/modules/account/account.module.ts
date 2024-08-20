import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';


@NgModule({
  declarations: [
    ConfirmEmailComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
