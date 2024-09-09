import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageRoutingModule } from './package-routing.module';
import { AddPackageComponent } from './components/add-package/add-package.component';
import { PackagesComponent } from './components/packages/packages.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { EditPackageComponent } from './components/edit-package/edit-package.component';


@NgModule({
  declarations: [
    AddPackageComponent,
    PackagesComponent,
    EditPackageComponent
  ],
  imports: [
    CommonModule,
    PackageRoutingModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class PackageModule { }
