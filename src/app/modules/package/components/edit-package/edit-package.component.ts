import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageData } from 'src/app/modules/shared/models/package/packageData.model';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit, OnDestroy {
  editPackageForm: FormGroup;
  packageId!: number;

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editPackageForm = this.fb.group({
      packageName: ['', Validators.required],
      destination: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      viaDestination: [''],
      date: [''],
      availableSeat: ['', Validators.min(0)],
      images: this.fb.array([])
    });
  }

  get images(): FormArray {
    return this.editPackageForm.get('images') as FormArray;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.packageId = +params.get('id')!;
      this.loadPackage();
    });
  }

  loadPackage(): void {
    this.packageService.getPackageById(this.packageId).subscribe(
      (packageData: PackageData) => {
        this.editPackageForm.patchValue({
          packageName: packageData.packageName,
          destination: packageData.destination,
          price: packageData.price,
          description: packageData.packageData?.description || '',
          viaDestination: packageData.packageData?.viaDestination || '',
          date: packageData.packageData?.date ? new Date(packageData.packageData.date).toISOString().split('T')[0] : '',
          availableSeat: packageData.packageData?.availableSeat || 0
        });

        if (packageData.packageData?.packageImages) {
          const images = this.images;
          packageData.packageData.packageImages.forEach(image => {
            images.push(this.fb.group({
              filename: [image.filename, Validators.required],
              filetype: [image.filetype, Validators.required],
              filesize: [image.filesize]
            }));
          });
        }
      },
      error => {
        console.error('Error fetching package details:', error);
      }
    );
  }

  addImage(): void {
    this.images.push(this.fb.group({
      filename: ['', Validators.required],
      filetype: ['', Validators.required],
      filesize: ['']
    }));
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  onSubmit(): void {
    if (this.editPackageForm.valid) {
      const updatedPackage: PackageData = {
        ...this.editPackageForm.value,
        packageId: this.packageId,
        // Ensure the data structure matches the expected backend format
      };

      this.packageService.updatePackage(this.packageId, updatedPackage).subscribe(
        () => this.router.navigate(['/packages']),
        error => console.error('Error updating package:', error)
      );
    }
  }
}