import { Component, OnInit } from '@angular/core';
import { MemberView } from 'src/app/modules/shared/models/admin/memberView.model';
import { AdminService } from '../../services/admin.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  members: MemberView[] = [];
  memberToDelete: MemberView | undefined;

  constructor(
    private adminService: AdminService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.adminService.getMembers().subscribe({
      next: members => this.members = members
    });
  }

  lockMember(id: string) {
    this.adminService.lockMember(id).subscribe({
      next: _ => {
        this.handleLockUnlockFilterAndMessage(id, true);
      }
    });
  }

  unlockMember(id: string) {
    this.adminService.unlockMember(id).subscribe({
      next: _ => {
        this.handleLockUnlockFilterAndMessage(id, false);
      }
    });
  }



  unconfirmMember(id: string) {
    this.adminService.unConfirmEmail(id).subscribe({
      next: _ => {
        this.handleEmailConfirmFilterAndMessage(id, false);
      }
    });
  }

  confirmMember(id: string) {
    this.adminService.confirmEmail(id).subscribe({
      next: _ => {
        this.handleEmailConfirmFilterAndMessage(id, true);
      }
    });
  }



  deleteMember(id: string) {
    const member = this.findMember(id);
    if (member) {
      this.memberToDelete = member;
      // Bootstrap 5 modal programmatically show করার জন্য
      const modalElement = document.getElementById('deleteModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  confirm() {
    if (this.memberToDelete) {
      this.adminService.deleteMember(this.memberToDelete.id).subscribe({
        next: _ => {
          this.sharedService.showNotification(true, 'Deleted', `Member of ${this.memberToDelete?.userName} has been deleted!`);
          this.members = this.members.filter(x => x.id !== this.memberToDelete?.id);
          this.memberToDelete = undefined;
          // Modal hide করার জন্য
          const modalElement = document.getElementById('deleteModal');
          if (modalElement) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
            modal.hide();
          }
        }
      });
    }
  }

  decline() {
    this.memberToDelete = undefined;
    // Modal hide করার জন্য
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

  private handleLockUnlockFilterAndMessage(id: string, locking: boolean) {
    const member = this.findMember(id);
    if (member) {
      member.isLocked = !member.isLocked;
      if (locking) {
        this.sharedService.showNotification(true, 'Locked', `${member.userName} member has been locked`);
      } else {
        this.sharedService.showNotification(true, 'Unlocked', `${member.userName} member has been unlocked`);
      }
    }
  }


  private handleEmailConfirmFilterAndMessage(id: string, confirming: boolean) {
    const member = this.findMember(id);
    if (member) {
      member.isEmailConfirmed = !member.isEmailConfirmed;
      if (confirming) {
        this.sharedService.showNotification(true, 'Email Confirmed', `${member.userName} member has been email comfirmed`);
      } else {
        this.sharedService.showNotification(false, 'Email Unconfirmed', `${member.userName} member has been email unconfirmed`);
      }
    }
  }


  private findMember(id: string): MemberView | undefined {
    return this.members.find(x => x.id === id);
  }
}