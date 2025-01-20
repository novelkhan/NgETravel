import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { addPackage } from '../../shared/models/package/addPackage.model';
import { Packages } from '../../shared/models/package/packages.model';
import { Package } from '../../shared/models/package/package.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root', // Makes this service available application-wide
})
export class PackageService {
  // Injecting HttpClient to handle HTTP requests
  constructor(private http: HttpClient) {}

  /**
   * Fetch all packages from the backend.
   * @returns Observable of an array of `Packages` objects.
   */
  getAllPackages(): Observable<Packages[]> {
    return this.http.get<Packages[]>(`${environment.apiUrl}/api/package/packages`);
  }

  /**
   * Add a new package.
   * @param model The data model for the new package.
   * @returns Observable of the HTTP POST response.
   */
  addPackage(model: addPackage): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/package/add-package`, model);
  }

  /**
   * Fetch details of a specific package by its ID.
   * @param id The unique identifier of the package.
   * @returns Observable of the `Package` object.
   */
  getPackageById(id: number): Observable<Package> {
    return this.http.get<Package>(`${environment.apiUrl}/api/package/package/${id}`);
  }

  /**
   * Update an existing package.
   * @param id The unique identifier of the package to update.
   * @param packageData FormData containing updated package details.
   * @returns Observable of the HTTP PUT response.
   */
  updatePackage(id: string, packageData: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/package/package/${id}`, packageData, {
      headers: {
        // No need to manually set `Content-Type` header for FormData; the browser will handle it.
      },
    });
  }
}