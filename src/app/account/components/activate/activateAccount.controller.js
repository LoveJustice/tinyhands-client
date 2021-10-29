export default class ActivateAccountController {
    constructor($scope, $state, AccountService, SessionService) {
        'ngInject';
        this.$scope = $scope;
        this.$state = $state;
        this.AccountService = AccountService;
        this.session = SessionService;

        SessionService.clearSession();
        this.activateAccount();
    }

    activateAccount() {
        if (this.$state.params.activation_key !== null) {
            this.alreadyActive = false;
            this.invalidAccount = false;
            this.AccountService.activateAccount(this.$state.params.activation_key).then((response) => {
                if (response.data && typeof response.data === 'string' && response.data.indexOf("account_already_active") !== -1) {
                    this.alreadyActive = true;
                } else if (response.data && typeof response.data === 'string' && response.data.indexOf("invalid_key") !== -1) {
                    this.invalidAccount = true;
                    this.account = null;
                } else {
                    this.invalidAccount = false;
                    this.account = response.data;
                }
            },
            () => {
                this.invalidAccount = true;
            });
        }
    }

    update() {
        this.AccountService.activateAccountPassword(this.$state.params.activation_key, this.account).then((response) => {
        	this.nonMatchingPasswords = false;
        	this.alreadyActive = false;
        	this.passwordTooShort = false;
            if (response.data === "unmatching_passwords") {
                this.nonMatchingPasswords = true;
            }
            else if (response.data === "account_already_active") {
                this.alreadyActive = true;
            }
            else if (response.data === "password_too_short") {
            	this.passwordTooShort = true;
            }
            else if (response.data === "account_saved") {
                this.session.attemptLogin(this.account.email, this.account.password1).then(() => {
                    this.$state.go('dashboard');
                }, (reason) => {
                    this.toastr.error(reason);
                });
            }
        });
    }
}
