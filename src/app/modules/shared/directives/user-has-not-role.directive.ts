import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../account/services/account.service';
import { jwtDecode } from 'jwt-decode';
import { take } from 'rxjs';

@Directive({
  selector: '[appUserHasNotRole]'
})
export class UserHasNotRoleDirective implements OnInit {
  @Input() appUserHasNotRole: string[] = [];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          const decodedToken: any = jwtDecode(user.jwt);

          if (Array.isArray(decodedToken.role)) {
            // যদি রোলগুলোর মধ্যে কোনোটি appUserHasNotRole-এ থাকে, তাহলে টেমপ্লেট হাইড করব
            if (decodedToken.role.some((role: any) => this.appUserHasNotRole.includes(role))) {
              this.viewContainerRef.clear();
            } else {
              // যদি কোনো রোল না মেলে, তাহলে টেমপ্লেট দেখাব
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          } else {
            // যদি রোল সিঙ্গেল স্ট্রিং হয় এবং appUserHasNotRole-এ থাকে, তাহলে হাইড করব
            if (this.appUserHasNotRole.includes(decodedToken.role)) {
              this.viewContainerRef.clear();
            } else {
              // যদি রোল না মেলে, তাহলে টেমপ্লেট দেখাব
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        } else {
          // যদি ইউজার না থাকে, তাহলে টেমপ্লেট হাইড করব
          this.viewContainerRef.clear();
        }
      }
    });
  }
}