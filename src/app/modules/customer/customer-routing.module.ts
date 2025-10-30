// src/app/modules/customer/customer-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { AuthorizationGuard } from '../shared/guards/authorization.guard';
import { CustomerGuard } from '../shared/guards/customer.guard';
import { NotAdminGuard } from '../shared/guards/not-admin.guard';
import { GetProfileComponent } from './components/get-profile/get-profile.component';
import { CustomerComponent } from './components/customer/customer.component';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthorizationGuard, CustomerGuard, NotAdminGuard],
    children: [
      { path: '', component: CustomerComponent},
      { path: 'dashboard', component: CustomerDashboardComponent },
      { path: 'profile', component: GetProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }