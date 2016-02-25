export default class AccountController {
  constructor($scope, $http, $location, $window, $uibModal, AccountService, PermissionsSetsService) {
    'ngInject';

    this.AccountsService = AccountService
    this.PermissionsSetsService = PermissionsSetsService
    this.$uibModal = $uibModal
    this.activate();
  }

  activate() {
    this.AccountsService.getAccounts().then((response) => {
      this.accounts = response.data;
    });
    this.PermissionsSetsService.getPermissions().then((response) => {
      this.permissions = response.data;
    });
    this.AccountsService.getMe().then((response) => {
      this.currentuser = response.data;
    });
  }


  resendActivationEmail(accountID) {
    this.AccountsService.resendActivationEmail({id:accountID});
  }

  openModal(account) {
    var user_name = account.first_name+" "+account.last_name;
    var deleteModal = this.$uibModal.open({
      templateUrl:'app/account/components/defaults/accountModal.html',
      controller: 'AccountModalController',
      controllerAs: 'AccountModalCtrl',
      resolve: {
        user_name:() => {
          return user_name;
        }
      }
    });
    deleteModal.result.then(() => {
        this.AccountsService.destroy(account.id).then(() => {
        this.AccountsService.getAccounts().then((response) => {
          this.accounts = response.data;
        });
      });
    });
  }

}