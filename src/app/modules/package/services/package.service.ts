import { Injectable } from '@angular/core';
import { addPackage } from '../../shared/models/package/addPackage.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Packages } from '../../shared/models/package/packages.model';
import { Observable } from 'rxjs';
import { PackageData } from '../../shared/models/package/packageData.model';

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


  getPackageById(id: number): Observable<PackageData> {
    return this.http.get<PackageData>(`${environment.apiUrl}/api/package/package/${id}`);
  }

  updatePackage(id: number, updatedPackage: PackageData) {
    return this.http.put(`${environment.apiUrl}/api/package/package/${id}`, updatedPackage);
  }
}