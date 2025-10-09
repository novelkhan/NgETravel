import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../account/services/account.service';
import { jwtDecode } from 'jwt-decode';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appUserHasNotRole]'
})
export class UserHasNotRoleDirective implements OnInit, OnDestroy {
  
  @Input() appUserHasNotRole: string[] = [];
  private destroy$ = new Subject<void>();
  private hasView = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // Continuously observe user changes
    this.accountService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: user => {
        if (user) {
          const decodedToken: any = jwtDecode(user.jwt);
          
          let hasExcludedRole = false;

          // Check if user has any of the excluded roles
          if (Array.isArray(decodedToken.role)) {
            hasExcludedRole = decodedToken.role.some((role: any) => this.appUserHasNotRole.includes(role));
          } else {
            hasExcludedRole = this.appUserHasNotRole.includes(decodedToken.role);
          }

          // Show element only if user does NOT have the excluded role
          if (!hasExcludedRole && !this.hasView) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
            this.hasView = true;
          } else if (hasExcludedRole && this.hasView) {
            this.viewContainerRef.clear();
            this.hasView = false;
          }
        } else {
          // No user logged in - hide the element
          if (this.hasView) {
            this.viewContainerRef.clear();
            this.hasView = false;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}