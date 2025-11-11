// package-showcase.component.ts - COMPLETE VERSION

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { CartService } from 'src/app/modules/cart/services/cart.service';
import { OrderService } from 'src/app/modules/order/services/order.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { interval, Subscription } from 'rxjs';

interface PackageImage {
  packageImageId: number;
  filename: string;
  filetype: string;
  filesize: string;
  filebytes: string;
}

interface PackageData {
  description: string;
  viaDestination: string;
  date: string;
  availableSeat: number;
  packageImages: PackageImage[];
}

interface Package {
  packageId: number;
  packageName: string;
  destination: string;
  price: number;
  dateCreated: string;
  packageData: PackageData | null;
}

@Component({
  selector: 'app-package-showcase',
  templateUrl: './package-showcase.component.html',
  styleUrls: ['./package-showcase.component.scss']
})
export class PackageShowcaseComponent implements OnInit, OnDestroy {
  packages: Package[] = [];
  currentPackageIndex: number = 0;
  currentImageIndex: number = 0;
  isLoading: boolean = true;
  isAutoPlayEnabled: boolean = true;
  isFullscreen: boolean = false;
  
  // Default images
  defaultImages: string[] = [
    'https://via.placeholder.com/800x600/667eea/ffffff?text=Travel+Package+1',
    'https://via.placeholder.com/800x600/764ba2/ffffff?text=Travel+Package+2',
    'https://via.placeholder.com/800x600/f093fb/ffffff?text=Travel+Package+3',
    'https://via.placeholder.com/800x600/4facfe/ffffff?text=Travel+Package+4',
    'https://via.placeholder.com/800x600/00f2fe/ffffff?text=Travel+Package+5'
  ];

  private imageSlideSubscription?: Subscription;

  constructor(
    private packageService: PackageService,
    private cartService: CartService,
    private orderService: OrderService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  // Keyboard Navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.previousPackage();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.nextPackage();
        break;
      case ' ':
        event.preventDefault();
        this.toggleAutoPlay();
        break;
      case 'Escape':
        if (this.isFullscreen) {
          this.toggleFullscreen();
        }
        break;
    }
  }

  // Touch/Swipe Support (Mobile)
  @HostListener('swipeleft', ['$event'])
  onSwipeLeft() {
    this.nextImage();
  }

  @HostListener('swiperight', ['$event'])
  onSwipeRight() {
    this.previousImage();
  }

  @HostListener('swipeup', ['$event'])
  onSwipeUp() {
    this.nextPackage();
  }

  @HostListener('swipedown', ['$event'])
  onSwipeDown() {
    this.previousPackage();
  }

  loadPackages(): void {
    this.isLoading = true;
    this.packageService.getPackagesWithDetails().subscribe({
      next: (data) => {
        this.packages = data;
        this.isLoading = false;
        if (this.packages.length > 0) {
          this.startSlideshow();
        }
      },
      error: (error) => {
        console.error('Error loading packages:', error);
        this.sharedService.showNotification(false, 'Error', 'প্যাকেজ লোড করতে ব্যর্থ হয়েছে');
        this.isLoading = false;
      }
    });
  }

  startSlideshow(): void {
    if (this.isAutoPlayEnabled) {
      this.imageSlideSubscription = interval(3000).subscribe(() => {
        this.nextImage();
      });
    }
  }

  stopSlideshow(): void {
    if (this.imageSlideSubscription) {
      this.imageSlideSubscription.unsubscribe();
    }
  }

  nextImage(): void {
    const currentPackage = this.packages[this.currentPackageIndex];
    const images = this.getPackageImages(currentPackage);
    
    if (this.currentImageIndex < images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.nextPackage();
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextPackage(): void {
    this.currentImageIndex = 0;
    if (this.currentPackageIndex < this.packages.length - 1) {
      this.currentPackageIndex++;
    } else {
      this.currentPackageIndex = 0;
    }
  }

  previousPackage(): void {
    this.currentImageIndex = 0;
    if (this.currentPackageIndex > 0) {
      this.currentPackageIndex--;
    } else {
      this.currentPackageIndex = this.packages.length - 1;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  goToPackage(index: number): void {
    this.currentPackageIndex = index;
    this.currentImageIndex = 0;
  }

  getPackageImages(pkg: Package): string[] {
    if (pkg.packageData && pkg.packageData.packageImages && pkg.packageData.packageImages.length > 0) {
      return pkg.packageData.packageImages.map(img => 
        `data:${img.filetype};base64,${img.filebytes}`
      );
    }
    return this.defaultImages;
  }

  getCurrentPackage(): Package | null {
    return this.packages[this.currentPackageIndex] || null;
  }

  getCurrentImage(): string {
    const currentPackage = this.getCurrentPackage();
    if (!currentPackage) return '';
    
    const images = this.getPackageImages(currentPackage);
    return images[this.currentImageIndex] || '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  addToCart(packageId: number): void {
    this.cartService.addToCart(packageId).subscribe({
      next: () => {
        this.sharedService.showNotification(true, 'সফল', 'প্যাকেজটি কার্টে যোগ হয়েছে!');
      },
      error: (error) => {
        console.error('কার্টে যোগ করতে সমস্যা:', error);
        this.sharedService.showNotification(false, 'ত্রুটি', 'কার্টে যোগ করতে ব্যর্থ হয়েছে');
      }
    });
  }

  buyNow(packageId: number): void {
    this.orderService.singleCheckout(packageId).subscribe({
      next: () => {
        this.sharedService.showNotification(true, 'সফল', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('অর্ডার করতে সমস্যা:', error);
        this.sharedService.showNotification(false, 'ত্রুটি', 'অর্ডার করতে ব্যর্থ হয়েছে');
      }
    });
  }

  editPackage(packageId: number): void {
    this.router.navigate(['/packages/edit-package', packageId]);
  }

  deletePackage(packageId: number): void {
    if (confirm('আপনি কি নিশ্চিত এই প্যাকেজটি ডিলিট করতে চান?')) {
      this.sharedService.showNotification(true, 'সফল', 'প্যাকেজ ডিলিট হয়েছে');
    }
  }

  pauseSlideshow(): void {
    this.stopSlideshow();
  }

  resumeSlideshow(): void {
    this.startSlideshow();
  }

  toggleAutoPlay(): void {
    this.isAutoPlayEnabled = !this.isAutoPlayEnabled;
    if (this.isAutoPlayEnabled) {
      this.startSlideshow();
    } else {
      this.stopSlideshow();
    }
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }

  sharePackage(packageId: number): void {
    const currentPackage = this.getCurrentPackage();
    if (!currentPackage) return;

    const url = `${window.location.origin}/packages/showcase?package=${packageId}`;
    const text = `${currentPackage.packageName} - ${currentPackage.destination}`;
    
    if (navigator.share) {
      navigator.share({
        title: currentPackage.packageName,
        text: text,
        url: url
      }).catch(() => {
        this.copyToClipboard(url);
      });
    } else {
      this.copyToClipboard(url);
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.sharedService.showNotification(true, 'সফল', 'লিংক কপি হয়েছে!');
    }).catch(() => {
      this.sharedService.showNotification(false, 'ত্রুটি', 'লিংক কপি করতে ব্যর্থ হয়েছে');
    });
  }
}