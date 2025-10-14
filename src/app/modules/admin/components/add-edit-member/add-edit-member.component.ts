import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-add-edit-member',
  templateUrl: './add-edit-member.component.html',
  styleUrls: ['./add-edit-member.component.scss']
})
export class AddEditMemberComponent implements OnInit {
  memberForm: FormGroup = new FormGroup({});
  addMode: boolean = true;
  memberId: string = '';
  submitted: boolean = false;
  errorMessages: string[] = [];
  applicationRoles: string[] = [];
  selectedRoles: string[] = [];

  constructor(
    private adminService: AdminService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (id) {
      this.addMode = false;
      this.memberId = id;
      this.getMember(id);
    }

    this.initializeForm();
    this.getApplicationRoles();
  }

  initializeForm() {
    this.memberForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [
        Validators.required,
        Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')
      ]],
      phoneNumber: ['', [
        Validators.minLength(11),
        Validators.maxLength(15),
        Validators.pattern('^[0-9]*$')
      ]],
      password: [''],
      roles: ['']
    });

    // Password required only for add mode
    if (this.addMode) {
      this.memberForm.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);
    } else {
      this.memberForm.get('password')?.setValidators([
        Validators.minLength(6)
      ]);
    }
  }

  getApplicationRoles() {
    this.adminService.getApplicationRoles().subscribe({
      next: (roles: string[]) => {
        this.applicationRoles = roles;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      }
    });
  }

  getMember(id: string) {
    this.adminService.getMember(id).subscribe({
      next: (member: any) => {
        this.memberForm.patchValue({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          userName: member.userName,
          phoneNumber: member.phoneNumber,  // Phone number load
          roles: member.roles
        });
        
        // Set selected roles
        if (member.roles) {
          this.selectedRoles = member.roles.split(',');
        }
      },
      error: (error) => {
        console.error('Error fetching member:', error);
        this.sharedService.showNotification(false, 'Error', 'Failed to load member data');
      }
    });
  }

  onRoleChange(event: any, role: string) {
    if (event.target.checked) {
      if (!this.selectedRoles.includes(role)) {
        this.selectedRoles.push(role);
      }
    } else {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    }
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }

  submit() {
    this.submitted = true;
    this.errorMessages = [];

    // Validate roles
    if (this.selectedRoles.length === 0) {
      this.errorMessages.push('At least one role must be selected');
      this.submitted = false;
      return;
    }

    if (this.memberForm.valid) {
      const formValue = {
        ...this.memberForm.value,
        roles: this.selectedRoles.join(',')
      };

      this.adminService.addEditMember(formValue).subscribe({
        next: (response: any) => {
          this.sharedService.showNotification(
            true, 
            response.value.title, 
            response.value.message
          );
          this.router.navigateByUrl('/admin');
        },
        error: (error) => {
          if (error.error.errors) {
            this.errorMessages = this.extractErrorMessages(error.error.errors);
          } else if (error.error) {
            this.errorMessages = [error.error];
          } else {
            this.errorMessages = ['An error occurred. Please try again.'];
          }
          this.submitted = false;
        }
      });
    } else {
      this.submitted = false;
    }
  }

  private extractErrorMessages(errors: any): string[] {
    const messages: string[] = [];
    
    if (typeof errors === 'object') {
      Object.keys(errors).forEach(key => {
        if (Array.isArray(errors[key])) {
          messages.push(...errors[key]);
        } else {
          messages.push(errors[key]);
        }
      });
    }
    
    return messages;
  }
}