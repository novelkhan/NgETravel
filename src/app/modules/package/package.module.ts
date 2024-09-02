import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageRoutingModule } from './package-routing.module';
import { AddPackageComponent } from './components/add-package/add-package.component';


@NgModule({
  declarations: [
    AddPackageComponent
  ],
  imports: [
    CommonModule,
    PackageRoutingModule
  ]
})
export class PackageModule { }
