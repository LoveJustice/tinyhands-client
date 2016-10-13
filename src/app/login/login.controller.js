class LoginController {
  constructor (SessionService) {
    'ngInject';

    this.password = "";
    this.username = "";
    this.session = SessionService;
  }

  attemptLogin() {
    this.session.attemptLogin(this.username, this.password);
  }
}

export default LoginController;
