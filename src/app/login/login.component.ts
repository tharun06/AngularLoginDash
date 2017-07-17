import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private identityService: IdentityService, private router: Router) { }

  username: string;
  password: string;

  onSubmit(event: Event) {
    event.preventDefault();
    this.identityService.login(this.username, this.password).then(() => {
      this.router.navigate(['/dashboard']);
    }).catch((err) => {
      console.error(err);
    });
  }

  ngOnInit() {
    if (this.identityService.getUser()) this.router.navigate(['/dashboard']);
  }

}
