import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerGuard } from '../shared/guards/customer.guard';
import { CartComponent } from './components/cart/cart.component';
import { NotAdminGuard } from '../shared/guards/not-admin.guard';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [CustomerGuard, NotAdminGuard],
    children: [
      { path: '', component: CartComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }