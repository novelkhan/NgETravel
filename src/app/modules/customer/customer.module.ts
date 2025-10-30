import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { SharedModule } from "src/app/modules/shared/shared.module";
import { CustomerComponent } from './components/customer/customer.component';
import { GetProfileComponent } from './components/get-profile/get-profile.component';


@NgModule({
  declarations: [
    CustomerDashboardComponent,
    CustomerComponent,
    GetProfileComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
]
})
export class CustomerModule { }