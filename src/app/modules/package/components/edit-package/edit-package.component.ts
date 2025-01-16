import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss'],
})
export class EditPackageComponent implements OnInit {
  package: any = null; // Holds the package data

  constructor(
    private packageService: PackageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Lifecycle hook called on component initialization.
   * Fetches the package data based on the ID from the route.
   */
  ngOnInit(): void {
    const id: number = isNaN(+this.route.snapshot.params['id'])
      ? 0 // Default value or error handling
      : +this.route.snapshot.params['id'];

    this.packageService.getPackageById(id).subscribe((data) => {
      this.package = data;

      // Initialize packageData if not defined
      if (!this.package.packageData) {
        this.package.packageData = {
          packageDataId: 0,
          description: '',
          viaDestination: '',
          date: '',
          availableSeat: 0,
          packageImages: [],
        };
      }


      // Format the date to 'yyyy-MM-dd' for the input field
      if (this.package.packageData.date) {
        this.package.packageData.date = new Date(this.package.packageData.date)
          .toISOString()
          .split('T')[0];
      }



      // Initialize packageImages array if undefined
      if (!this.package.packageData.packageImages) {
        this.package.packageData.packageImages = [];
      }

      // Transform packageImages for preview and file management
      this.package.packageData.packageImages = this.package.packageData.packageImages.map((img: any) => ({
        ...img,
        url: img.filebytes ? 'data:image/jpeg;base64,' + img.filebytes : '',
        imageFile: null, // Placeholder for new uploads
      }));
    });
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
    if (!this.package.packageData.packageImages) {
      this.package.packageData.packageImages = []; // Initialize array if not defined
    }

    // Add a new image slot with default properties
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
   * Collects form data, prepares it for submission, and sends it to the service.
   */
  onSubmit(): void {
    if (!this.package?.packageId) {
      alert('Package ID is missing.');
      return;
    }

    const formData = new FormData();

    // Append basic package fields
    formData.append('packageId', this.package.packageId.toString());
    formData.append('packageName', this.package.packageName);
    formData.append('destination', this.package.destination);
    formData.append('price', this.package.price.toString());
    formData.append('dateCreated', this.package.dateCreated);

    // Append packageData fields
    if (this.package.packageData) {
      formData.append('packageData.packageDataId', this.package.packageData.packageDataId.toString());
      formData.append('packageData.description', this.package.packageData.description);
      formData.append('packageData.viaDestination', this.package.packageData.viaDestination);
      formData.append('packageData.date', this.package.packageData.date);
      formData.append('packageData.availableSeat', this.package.packageData.availableSeat.toString());
    }

    // Append packageImages
    if (this.package.packageData?.packageImages) {
      this.package.packageData.packageImages.forEach((image: any, index: number) => {
        if (image.imageFile) {
          // Append the image file for upload
          formData.append(`packageData.packageImages[${index}].imageFile`, image.imageFile, image.filename || `image_${index}`);
        }

        // Include existing packageImageId for tracking (if available)
        if (image.packageImageId) {
          formData.append(`packageData.packageImages[${index}].packageImageId`, image.packageImageId.toString());
        }

        // Append additional metadata
        formData.append(`packageData.packageImages[${index}].filename`, image.filename || '');
        formData.append(`packageData.packageImages[${index}].filetype`, image.filetype || '');
        formData.append(`packageData.packageImages[${index}].filesize`, image.filesize || '');
      });
    }

    // Debug: Log FormData keys and values
    for (const [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    // Call the service to update the package
    this.packageService.updatePackage(this.package?.packageId, formData).subscribe(
      () => {
        alert('Package updated successfully!');
        this.router.navigate(['/packages']);
      },
      (error) => {
        console.error('Failed to update package:', error);
        alert('Error updating package.');
      }
    );
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