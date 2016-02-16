export default class AccountController {
    constructor($scope, $http, $location, $window, AccountService, PermissionsSetsService) {
    'ngInject';

    this.activate();
    }

    activate() {
      this.accounts = AccountService.all();
      this.permissions = PermissionsSetsService.all();
      this.currentuser = AccountService.me();
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