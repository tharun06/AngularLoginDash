import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;

  constructor(private identityService: IdentityService, private router: Router) {
    if (!this.identityService.getUser()) {
      this.router.navigate(['/login']);
    } else {
      this.user = this.identityService.getUser();
    }
  }

  logout() {
    this.identityService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
