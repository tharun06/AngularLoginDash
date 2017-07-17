import { AngularLoginDashPage } from './app.po';

describe('angular-login-dash App', () => {
  let page: AngularLoginDashPage;

  beforeEach(() => {
    page = new AngularLoginDashPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
