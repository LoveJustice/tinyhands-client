export default class AccountListController {
  constructor($scope, $http, $location, $window, $uibModal, AccountService, PermissionsSetsService) {
    'ngInject';

    this.AccountsService = AccountService
    this.PermissionsSetsService = PermissionsSetsService
    this.$uibModal = $uibModal

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
    this.AccountsService.resendActivationEmail(accountID);
  }

  deleteAccount(account){
    if(this.currentuser.id != account.id){
      if(account.accountdelete){
        this.AccountsService.destroy(account.id).then(() =>{
            window.toastr.success("Account Role Successfully Deleted");
            this.AccountsService.getAccounts().then((response) =>{
            this.accounts = response.data;
          });
        });
      }
      else{
        account.accountdelete = true;
      }
    }
  }
}