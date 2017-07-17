import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from './identity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private identityService: IdentityService, private router: Router) {
    if (this.identityService.getUser()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
