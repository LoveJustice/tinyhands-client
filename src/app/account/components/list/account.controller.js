export default class AccountController {
    constructor($scope, $http, $location, $window, AccountService, PermissionsSetsService) {
    'ngInject';

    this.AccountsService = AccountService
    this.PermissionsSetsService = PermissionsSetsService
    this.activate();
    }
t
    activate() {
      console.log("get")
      this.AccountsService.getAccounts().then((response) => {
        this.accounts = response.data;
      });
      this.PermissionsSetsService.getPermissions().then((response) => {
        this.permissions = response.data;
      });
      this.AccountsService.getUser().then((response) => {
        this.currentuser = response.data;
      });
      //this.currentuser = AccountService.me();
    }

    resendActivationEmail(accountID) {
      Accounts.resendActivationEmail({id:accountID});
    };

    openModal(account) {
      var user_name = account.first_name+" "+account.last_name;
      var deleteModal = $modal.open({
        templateUrl: 'modal.html',
        controller: 'ModalCtrl',
        controllerAs: 'modalCtrl',
        resolve: {
          user_name:() => {
            return user_name;
          }
        }
      });
      deleteModal.result.then(() => {
        AccountService.destroy({id:account.id}).$promise.then(() => {
          this.accounts = AccountService.all();
        })
      })
    }

}