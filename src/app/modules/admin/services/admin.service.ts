import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  /**
   * Get all members
   */
  getMembers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/admin/get-members`);
  }

  /**
   * Get single member by ID
   */
  getMember(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/admin/get-member/${id}`);
  }

  /**
   * Add or edit member
   */
  addEditMember(model: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/admin/add-edit-member`, model);
  }

  /**
   * Lock member account
   */
  lockMember(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/admin/lock-member/${id}`, {});
  }

  /**
   * Unlock member account
   */
  unlockMember(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/admin/unlock-member/${id}`, {});
  }

  /**
   * Confirm member's email
   */
  confirmEmail(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/admin/confirmEmail/${id}`, {});
  }

  /**
   * Unconfirm member's email
   */
  unconfirmEmail(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/admin/unConfirmEmail/${id}`, {});
  }

  /**
   * Delete member
   */
  deleteMember(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/admin/delete-member/${id}`);
  }

  /**
   * Get all application roles
   */
  getApplicationRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/api/admin/get-application-roles`);
  }
}