export default class ActivateAccountController {
  constructor($scope, $state, AccountService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.AccountService = AccountService;

    if (this.$state.params.code != null){
      this.AccountService.activateAccount().then((response) => {
        console.log('This is the response', response);
      });
    }
  }
}