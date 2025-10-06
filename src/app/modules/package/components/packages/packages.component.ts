import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../services/package.service';
import { CartService } from 'src/app/modules/cart/services/cart.service';
import { OrderService } from 'src/app/modules/order/services/order.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

  packages: any[] = [];

  constructor(
    private packageService: PackageService,
    private cartService: CartService,
    private orderService: OrderService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.packageService.getAllPackages().subscribe(records => {
      this.packages = records.map(record => ({
        packageId: record.packageId,
        packageName: record.packageName,
        destination: record.destination,
        price: record.price
      }));
    });
  }

  /**
   * Add To Cart বাটন ক্লিক হ্যান্ডলার
   */
  addToCart(packageId: number): void {
    this.cartService.addToCart(packageId).subscribe({
      next: (response) => {
        this.sharedService.showNotification(true, 'Success', 'প্যাকেজটি কার্টে যোগ হয়েছে!');
      },
      error: (error) => {
        console.error('কার্টে যোগ করতে সমস্যা হয়েছে:', error);
        this.sharedService.showNotification(false, 'Error', 'কার্টে যোগ করতে ব্যর্থ হয়েছে।');
      }
    });
  }

  /**
   * Buy Now বাটন ক্লিক হ্যান্ডলার
   */
  buyNow(packageId: number): void {
    this.orderService.singleCheckout(packageId).subscribe({
      next: (response) => {
        this.sharedService.showNotification(true, 'Success', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
        // অর্ডার হিস্টোরি পেজে রিডাইরেক্ট করুন
        this.router.navigate(['/order-history']);
      },
      error: (error) => {
        console.error('অর্ডার করতে সমস্যা হয়েছে:', error);
        this.sharedService.showNotification(false, 'Error', 'অর্ডার করতে ব্যর্থ হয়েছে।');
      }
    });
  }
}