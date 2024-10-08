import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { MemberAddEdit } from '../../shared/models/admin/memberAddEdit.model';
import { HttpClient } from '@angular/common/http';
import { MemberView } from '../../shared/models/admin/memberView.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get<MemberView[]>(`${environment.apiUrl}/api/admin/get-members`);
  }

  getMember(id: string) {
    return this.http.get<MemberAddEdit>(`${environment.apiUrl}/api/admin/get-member/${id}`);
  }

  getApplicationRoles() {
    return this.http.get<string[]>(`${environment.apiUrl}/api/admin/get-application-roles`);
  }

  addEditMember(model: MemberAddEdit) {
    return this.http.post(`${environment.apiUrl}/api/admin/add-edit-member`, model);
  }

  lockMember(id: string) {
    return this.http.put(`${environment.apiUrl}/api/admin/lock-member/${id}`, {});
  }

  unlockMember(id: string) {
    return this.http.put(`${environment.apiUrl}/api/admin/unlock-member/${id}`, {});
  }

  deleteMember(id: string) {
    return this.http.delete(`${environment.apiUrl}/api/admin/delete-member/${id}`, {});
  }
}