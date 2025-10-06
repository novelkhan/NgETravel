import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss'],
})
export class EditPackageComponent implements OnInit {
  // Holds the package data to be edited
  package: any = null;

  constructor(
    private sharedService: SharedService,
    private packageService: PackageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Lifecycle hook called upon component initialization.
   * Fetches the package data based on the ID from the route parameters.
   */
  ngOnInit(): void {
    const id: number = this.extractPackageIdFromRoute();

    this.packageService.getPackageById(id).subscribe(
      (data) => this.initializePackageData(data),
      (error) => {
        console.error('Failed to fetch package data:', error);
        alert('Error fetching package data.');
      }
    );
  }

  /**
   * Extracts the package ID from the route parameters.
   * Returns 0 if the ID is not a valid number.
   */
  private extractPackageIdFromRoute(): number {
    const idParam = this.route.snapshot.params['id'];
    return isNaN(+idParam) ? 0 : +idParam;
  }

  /**
   * Initializes the package data and prepares it for editing.
   * Ensures proper structure and formatting for all fields.
   */
  private initializePackageData(data: any): void {
    this.package = data;

    // Initialize packageData with default values if undefined
    this.package.packageData = this.package.packageData || {
      packageDataId: 0,
      description: '',
      viaDestination: '',
      date: '',
      availableSeat: 0,
      packageImages: [],
    };

    // Format date for the input field (yyyy-MM-dd)
    if (this.package.packageData.date) {
      this.package.packageData.date = this.formatDateForInput(this.package.packageData.date);
    }

    // Initialize packageImages array if undefined
    this.package.packageData.packageImages = this.package.packageData.packageImages || [];

    // Enhance packageImages with additional properties for preview and uploads
    this.package.packageData.packageImages = this.package.packageData.packageImages.map((img: any) => ({
      ...img,
      url: img.filebytes ? `data:image/jpeg;base64,${img.filebytes}` : '',
      imageFile: null, // Placeholder for new file uploads
    }));
  }

  /**
   * Formats a date to 'yyyy-MM-dd' for use in date input fields.
   */
  private formatDateForInput(date: string | Date): string {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Handles file selection for image uploads.
   * Updates the corresponding image object in the package data.
   */
  onFileSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const image = this.package.packageData.packageImages[index];
      image.imageFile = file;
      image.filename = file.name;
      image.filetype = file.type;
      image.filesize = file.size.toString();

      // Generate a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        image.url = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Adds a new slot for uploading an image.
   */
  addNewImageSlot(): void {
    this.package.packageData.packageImages = this.package.packageData.packageImages || [];
    this.package.packageData.packageImages.push({
      packageImageId: null,
      filename: '',
      filetype: '',
      filesize: '',
      filebytes: '',
      url: '',
      imageFile: null,
    });
  }

  /**
   * Removes an image from the package data by index.
   */
  removeImage(index: number): void {
    this.package.packageData.packageImages.splice(index, 1);
  }

  /**
   * Submits the form data to update the package.
   * Prepares form data for submission and sends it to the service.
   */
  onSubmit(): void {
    if (!this.package?.packageId) {
      alert('Package ID is missing.');
      return;
    }

    const formData = this.prepareFormData();

    this.packageService.updatePackage(this.package.packageId, formData).subscribe(
      () => {
        this.sharedService.showNotification(true, 'Updated', 'Package updated successfully!');
        this.router.navigate(['/packages']);
      },
      (error) => {
        console.error('Failed to update package:', error);
        this.sharedService.showNotification(false, 'Error', 'Error updating package.');
      }
    );
  }

  /**
   * Prepares a FormData object for submitting package updates.
   */
  private prepareFormData(): FormData {
    const formData = new FormData();

    // Add basic package fields
    formData.append('packageId', this.package.packageId.toString());
    formData.append('packageName', this.package.packageName);
    formData.append('destination', this.package.destination);
    formData.append('price', this.package.price.toString());
    formData.append('dateCreated', this.package.dateCreated);

    // Add packageData fields
    if (this.package.packageData) {
      formData.append('packageData.packageDataId', this.package.packageData.packageDataId.toString());
      formData.append('packageData.description', this.package.packageData.description);
      formData.append('packageData.viaDestination', this.package.packageData.viaDestination);
      formData.append('packageData.date', this.package.packageData.date);
      formData.append('packageData.availableSeat', this.package.packageData.availableSeat.toString());
    }

    // Add packageImages
    if (this.package.packageData?.packageImages) {
      this.package.packageData.packageImages.forEach((image: any, index: number) => {
        if (image.imageFile) {
          formData.append(`packageData.packageImages[${index}].imageFile`, image.imageFile, image.filename || `image_${index}`);
        }
        if (image.packageImageId) {
          formData.append(`packageData.packageImages[${index}].packageImageId`, image.packageImageId.toString());
        }
        formData.append(`packageData.packageImages[${index}].filename`, image.filename || '');
        formData.append(`packageData.packageImages[${index}].filetype`, image.filetype || '');
        formData.append(`packageData.packageImages[${index}].filesize`, image.filesize || '');
      });
    }

    return formData;
  }
}






























// /* /*  implements OnInit {/* , OnDestroy { */

//   id: number | null = null;
//   // paramsSubscription?: Subscription;
//   // editPackageSubscription?: Subscription;
  
//   // editPackageForm: FormGroup;
//   //packageId!: number;
//   // package?: Package;
//   package?: any;


//   constructor(
//     //private fb: FormBuilder,
//     private packageService: PackageService,
//     private route: ActivatedRoute,
//     //private router: Router
//   ) {
//     // this.editPackageForm = this.fb.group({
//     //   packageName: ['', Validators.required],
//     //   destination: ['', Validators.required],
//     //   price: ['', [Validators.required, Validators.min(0)]],
//     //   description: [''],
//     //   viaDestination: [''],
//     //   date: [''],
//     //   availableSeat: ['', Validators.min(0)],
//     //   images: this.fb.array([])
//     // });
//   }

//   // get images(): FormArray {
//   //   return this.editPackageForm.get('images') as FormArray;
//   // }

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       this.id = +params.get('packageId')!;   //this.id = parseInt(params.get('packageId') as string, 10);  ///parseInt(..., 10): Converts the string to a number. The second argument, 10, specifies the base (decimal) for parsing.
//       this.loadPackage();
//     });
//   }

//   loadPackage(): void {
//     // this.packageService.getPackageById(this.packageId).subscribe(
//     //   (packageValue: Package) => {
//     //     this.editPackageForm.patchValue({
//     //       packageName: packageData.packageName,
//     //       destination: packageData.destination,
//     //       price: packageData.price,
//     //       description: packageData.packageData?.description || '',
//     //       viaDestination: packageData.packageData?.viaDestination || '',
//     //       date: packageData.packageData?.date ? new Date(packageData.packageData.date).toISOString().split('T')[0] : '',
//     //       availableSeat: packageData.packageData?.availableSeat || 0
//     //     });

//     //     if (packageData.packageData?.packageImages) {
//     //       const images = this.images;
//     //       packageData.packageData.packageImages.forEach(image => {
//     //         images.push(this.fb.group({
//     //           filename: [image.filename, Validators.required],
//     //           filetype: [image.filetype, Validators.required],
//     //           filesize: [image.filesize]
//     //         }));
//     //       });
//     //     }
//     //   },
//     //   error => {
//     //     console.error('Error fetching package details:', error);
//     //   }
//     // );
  
//     /* this.packageService.getPackageById(this.id as number)
//           .subscribe({
//             next: (response) => {
//               this.package= response;
//             }
//           }); */

//     this.packageService.getPackageById(this.id as number)
//     .subscribe({
//       next: (response) => {


//         var pkgImg : any[] = []; 

//         response.packageData?.packageImages?.forEach( image => {
//           var pImg:any = {
//             packageImageId: image.packageImageId,
//             filename: image.filename,
//             filetype: image.filetype,
//             filesize: image.filesize,
//             filebytes: image.filebytes,  // Base64 or binary format depending on how it is serialized
//             url: 'data:image/jpeg;base64,' + image.filebytes,
            
//             packageDataId: image.packageDataId//,
//             //image: null

//           };

//           pkgImg.push(pImg);
//         });


//         // this.package= response;
//         var pkg:any = {
//           packageId : response.packageId,
//           packageName : response.packageName,
//           destination : response.destination,
//           price : response.price,
//           dateCreated : response.dateCreated,

//           packageDataId: response.packageData?.packageDataId,
//           description: response.packageData?.description,
//           viaDestination: response.packageData?.viaDestination,
//           date: response.packageData?.date,
//           availableSeat: response.packageData?.availableSeat,
//           packageImages: pkgImg
//        };

//        this.package = pkg;
//       }
//     });
//   }

//   // addImage(): void {
//   //   this.images.push(this.fb.group({
//   //     filename: ['', Validators.required],
//   //     filetype: ['', Validators.required],
//   //     filesize: ['']
//   //   }));
//   // }

//   // removeImage(index: number): void {
//   //   this.images.removeAt(index);
//   // }

//   onSubmit(): void {
//     // if (this.editPackageForm.valid) {
//     //   const updatedPackage: PackageData = {
//     //     ...this.editPackageForm.value,
//     //     packageId: this.packageId,
//     //     // Ensure the data structure matches the expected backend format
//     //   };

//     //   this.packageService.updatePackage(this.packageId, updatedPackage).subscribe(
//     //     () => this.router.navigate(['/packages']),
//     //     error => console.error('Error updating package:', error)
//     //   );
//     // }

    
//   }


//   // ngOnDestroy(): void {
//   //   this.paramsSubscription?.unsubscribe();
//   //   this.editPackageSubscription?.unsubscribe();
//   // }
// }