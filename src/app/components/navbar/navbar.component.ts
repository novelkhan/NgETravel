import { Component } from '@angular/core';
import { AccountService } from 'src/app/modules/account/services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  collapsed = true;

  constructor(public accountService: AccountService) { }

  logout() {
    this.accountService.logout();
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}