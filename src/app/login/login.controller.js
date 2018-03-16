class LoginController {
    constructor($state, $stateParams, toastr, SessionService) {
        'ngInject';

        this.returnStateName = $stateParams.returnState === undefined ? "dashboard" : $stateParams.returnState;
        this.returnStateParams = this.getStateParamsFromUrl($stateParams.params);
        this.password = "";
        this.username = "";
        this.$state = $state;
        this.toastr = toastr;
        this.session = SessionService;
        this.session.clearSession();
    }
    
    attemptLogin() {
        this.session.attemptLogin(this.username, this.password).then(() => {
            this.$state.go(this.returnStateName, this.returnStateParams);
        }, (reason) => {
            this.toastr.error(reason);
        });
    }

    getStateParamsFromUrl(queryString) {
        if (angular.isDefined(queryString)) {
            return JSON.parse('{"' + decodeURI(queryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        }
        return {};
    }
}

export default LoginController;
