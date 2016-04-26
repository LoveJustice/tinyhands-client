export default class ActivateAccountController {
  constructor($scope, $state, AccountService, session) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.AccountService = AccountService;
    this.session = session;

    if (this.$state.params.activation_key != null){
      this.AccountService.activateAccount(this.$state.params.activation_key).then((response) => {
        if (response.data == "account_already_active/invalid_key"){
          this.invalidAccount = true;
          this.account = null;
        }
        else {
          this.invalidAccount = false;
          this.account = response.data
        }
      });
    }
  }

  update(){
      this.AccountService.activateAccountPassword(this.$state.params.activation_key, this.account).then( (response) => {
        if (response.data == "unmatching_passwords") {
          this.nonMatchingPasswords = true;
        }
        else if (response.data == "account_already_active/invalid_key") {
          this.invalidAccount = true;
        }
        else if (response.data == "acount_saved") {
          this.session.attemptLogin(this.account.email, this.account.password1);
        }
      });
  }
}