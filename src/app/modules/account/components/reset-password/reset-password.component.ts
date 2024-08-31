import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ResetPassword } from 'src/app/modules/shared/models/account/resetPassword.model';
import { User } from 'src/app/modules/shared/models/account/user.model';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup = new FormGroup({});
  token: string | undefined;
  email: string | undefined;
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService: AccountService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              this.token = params.get('token');
              this.email = params.get('email');

              if (this.token && this.email) {
                this.initializeForm(this.email);
              } else {
                this.router.navigateByUrl('/account/login');
              }
            }
          })
        }
      }
    })
  }


  initializeForm(username: string) {
    this.resetPasswordForm = this.formBuilder.group({
      email: [{value: username, disabled: true}],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    })
  }

  resetPassword() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.resetPasswordForm.valid && this.email && this.token) {
      const model: ResetPassword = {
        token: this.token,
        email: this.email,
        newPassword: this.resetPasswordForm.get('newPassword')?.value
      };

      this.accountService.resetPassword(model).subscribe({
        next: (response: any) => {
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.router.navigateByUrl('/account/login');
        }, error: error => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        }
      })
    }
  }
}