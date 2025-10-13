import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { AddEditMemberComponent } from './components/add-edit-member/add-edit-member.component';
import { SharedModule } from '../shared/shared.module';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { FormsModule } from '@angular/forms';
import { AdminOrderDetailsComponent } from './components/admin-order-details/admin-order-details.component';


@NgModule({
  declarations: [
    AdminComponent,
    AddEditMemberComponent,
    AdminOrdersComponent,
    AdminOrderDetailsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
