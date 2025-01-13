import { Injectable } from '@angular/core';
import { addPackage } from '../../shared/models/package/addPackage.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Packages } from '../../shared/models/package/packages.model';
import { Observable } from 'rxjs';
import { PackageData } from '../../shared/models/package/packageData.model';
import { Package } from '../../shared/models/package/package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private http: HttpClient) { }




  getAllPackages(): Observable<Packages[]> {
    return this.http.get<Packages[]>(`${environment.apiUrl}/api/package/packages`);
  }


  addPackage(model: addPackage) {
    return this.http.post(`${environment.apiUrl}/api/package/add-package`, model);
  }


  getPackageById(id: number): Observable<Package> {
    return this.http.get<Package>(`${environment.apiUrl}/api/package/package/${id}`);
  }

  // updatePackage(id: number, updatedPackage: Package) {
  //   return this.http.put(`${environment.apiUrl}/api/package/package/${id}`, updatedPackage);
  // }

  updatePackage(id: string, packageData: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/package/package/${id}`, packageData, {
      headers: {
        // Ensure the `Content-Type` header is not set for FormData; the browser will set it automatically
      },
    });
  }
  
}