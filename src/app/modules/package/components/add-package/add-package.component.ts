import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.scss']
})
export class AddPackageComponent implements OnInit {
  
  addPackageForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(
    private packageService: PackageService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  

  initializeForm() {
    this.addPackageForm = this.formBuilder.group({
      packagename: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      destination: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    })
  }

  addPackage() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.addPackageForm.valid) {
      this.packageService.addPackage(this.addPackageForm.value).subscribe({
        next: (response: any) => {
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.router.navigateByUrl('/packages');
        },
        error: error => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        }
      })
    }
  }
}