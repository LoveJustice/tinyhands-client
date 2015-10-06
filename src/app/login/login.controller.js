class LoginController {
  constructor (session) {
    'ngInject';

    this.password = "";
    this.session = session;
    this.username = "";
  }
  
  attemptLogin() {
    this.session.attemptLogin(this.username, this.password);
  }
}

export default LoginController;
