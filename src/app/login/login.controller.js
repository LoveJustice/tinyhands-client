class LoginController {
    constructor($state, toastr, SessionService) {
        'ngInject';

        this.password = "";
        this.username = "";
        this.$state = $state;
        this.toastr = toastr;
        this.session = SessionService;
        this.session.clearSession();
    }

    attemptLogin() {
        this.session.attemptLogin(this.username, this.password).then(() => {
            this.$state.go('dashboard');
        }, (reason) => {
            this.toastr.error(reason);
        });
    }
}

export default LoginController;
