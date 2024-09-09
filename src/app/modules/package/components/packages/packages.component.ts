import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../services/package.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit{

  packages : any[] = [];
 

  constructor(private packageService: PackageService, private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.loadPackages();
  }



  loadPackages():void {
    this.packageService.getAllPackages().subscribe(records => {
      records.forEach( record => {
        var object:any = {
          packageId : record.packageId,
          packageName : record.packageName,
          destination : record.destination,
          price : record.price
        };
    
        this.packages.push(object);
      });
    });
    console.log(this.packages);
  }
}