// src/app/modules/customer/services/customer.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  /**
   * Get customer profile
   */
  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/customer/get-profile`);
  }

  /**
   * Update customer profile
   */
  updateProfile(model: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/customer/update-profile`, model);
  }

  /**
   * Change password
   */
  changePassword(model: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/customer/change-password`, model);
  }


  getCustomers(){
    return this.http.get(`${environment.apiUrl}/api/customer/get-customers`);
  }
}