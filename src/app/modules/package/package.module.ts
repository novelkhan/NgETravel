import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageRoutingModule } from './package-routing.module';
import { AddPackageComponent } from './components/add-package/add-package.component';
import { PackagesComponent } from './components/packages/packages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { EditPackageComponent } from './components/edit-package/edit-package.component';
import { PackageShowcaseComponent } from './components/package-showcase/package-showcase.component';


@NgModule({
  declarations: [
    AddPackageComponent,
    PackagesComponent,
    EditPackageComponent,
    PackageShowcaseComponent
  ],
  imports: [
    CommonModule,
    PackageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
],
exports: [PackageShowcaseComponent]
})
export class PackageModule { }
