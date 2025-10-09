import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../account/services/account.service';
import { jwtDecode } from 'jwt-decode';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appUserHasRole]'
})
export class UserHasRoleDirective implements OnInit, OnDestroy {

  @Input() appUserHasRole: string[] = [];
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
          
          let hasRole = false;

          // Check if user has the required role
          if (Array.isArray(decodedToken.role)) {
            hasRole = decodedToken.role.some((role: any) => this.appUserHasRole.includes(role));
          } else {
            hasRole = this.appUserHasRole.includes(decodedToken.role);
          }

          // Show or hide the element
          if (hasRole && !this.hasView) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
            this.hasView = true;
          } else if (!hasRole && this.hasView) {
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