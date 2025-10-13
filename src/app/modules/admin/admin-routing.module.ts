import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuard } from '../shared/guards/admin.guard';
import { AddEditMemberComponent } from './components/add-edit-member/add-edit-member.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminOrderDetailsComponent } from './components/admin-order-details/admin-order-details.component';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminComponent},
      // Member management routes
      { path: 'add-edit-member', component: AddEditMemberComponent},
      { path: 'add-edit-member/:id', component: AddEditMemberComponent},
      // Order management routes
      { path: 'orders', component: AdminOrdersComponent},
      { path: 'order-details/:id', component: AdminOrderDetailsComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }