// ng g c modules/customer/components/customer-dashboard --skip-tests

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({});
  passwordForm: FormGroup = new FormGroup({});
  
  profile: any = null;
  profileSubmitted: boolean = false;
  passwordSubmitted: boolean = false;
  errorMessages: string[] = [];
  
  showPasswordForm: boolean = false;

  constructor(
    private customerService: CustomerService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadProfile();
  }

  initializeForms() {
    // Profile Form
    this.profileForm = this.formBuilder.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]],
      phoneNumber: ['', [
        Validators.minLength(11),
        Validators.maxLength(15),
        Validators.pattern('^[0-9]*$')
      ]]
    });

    // Password Form
    this.passwordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ]],
      confirmNewPassword: ['', [Validators.required]]
    });
  }

  loadProfile() {
    this.customerService.getProfile().subscribe({
      next: (response: any) => {
        this.profile = response;
        this.profileForm.patchValue({
          firstName: response.firstName,
          lastName: response.lastName,
          phoneNumber: response.phoneNumber
        });
        this.passwordForm.patchValue({
          email: response.email
        });
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.sharedService.showNotification(false, 'Error', 'Failed to load profile');
      }
    });
  }

  updateProfile() {
    this.profileSubmitted = true;
    this.errorMessages = [];

    if (this.profileForm.valid) {
      this.customerService.updateProfile(this.profileForm.value).subscribe({
        next: (response: any) => {
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.loadProfile();
          this.profileSubmitted = false;
        },
        error: (error) => {
          if (error.error.errors) {
            this.errorMessages = this.extractErrorMessages(error.error.errors);
          } else if (error.error) {
            this.errorMessages = [error.error];
          }
          this.profileSubmitted = false;
        }
      });
    } else {
      this.profileSubmitted = false;
    }
  }

  changePassword() {
    this.passwordSubmitted = true;
    this.errorMessages = [];

    // Check if passwords match
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmNewPassword) {
      this.errorMessages = ['New password and confirm password do not match'];
      this.passwordSubmitted = false;
      return;
    }

    if (this.passwordForm.valid) {
      const passwordData = {
        email: this.passwordForm.value.email,
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.customerService.changePassword(passwordData).subscribe({
        next: (response: any) => {
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.passwordForm.reset();
          this.passwordForm.patchValue({ email: this.profile.email });
          this.showPasswordForm = false;
          this.passwordSubmitted = false;
        },
        error: (error) => {
          if (error.error.errors) {
            this.errorMessages = this.extractErrorMessages(error.error.errors);
          } else if (error.error) {
            this.errorMessages = [error.error];
          }
          this.passwordSubmitted = false;
        }
      });
    } else {
      this.passwordSubmitted = false;
    }
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
      this.passwordForm.patchValue({ email: this.profile?.email });
      this.errorMessages = [];
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}