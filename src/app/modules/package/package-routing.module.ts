import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../shared/guards/admin.guard';
import { AddPackageComponent } from './components/add-package/add-package.component';
import { PackagesComponent } from './components/packages/packages.component';
import { EditPackageComponent } from './components/edit-package/edit-package.component';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AdminGuard],
    children: [
      { path: '', component: PackagesComponent},
      // path for adding a new package
      { path: 'add-package', component: AddPackageComponent},
      // path for editing existing package
      { path: 'edit-package/:id', component: EditPackageComponent},
      // path for editing an existing member
      //{ path: 'add-edit-member/:id', component: AddEditMemberComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageRoutingModule { }
