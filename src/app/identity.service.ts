import { Injectable } from '@angular/core';
import { LocalLoginStrategyService } from './login.service';
import { User } from './user';

@Injectable()
export class IdentityService {

  constructor(private loginStrategy: LocalLoginStrategyService) {
    if (localStorage.serializedUser) {
      this.user = <User>JSON.parse(localStorage.serializedUser);
    }
  }

  private user: User = null;

  getUser(): User {
    return this.user;
  }

  login(username: string, password: string) {
    return this.loginStrategy.attemptLogin(username, password).then((user) => {
      localStorage.serializedUser = JSON.stringify(user);
      this.user = <User>user;
    });
  }

  logout(): void {
    this.user = null;
    localStorage.serializedUser = '';
  }

}
