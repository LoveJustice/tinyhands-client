function accountRouteConfig ($stateProvider) {
  'ngInject';
  $stateProvider
    .state('account list', {
          url: '/account/tab=:activeTab',
          templateUrl: 'app/account/account.html',
          data: {
            requireLogin: true
          }
    })

    .state('account', {
      url: '/account/:id',
      templateUrl: 'app/account/account.html',
      data: {
        requireLogin: true
      }
    })

    .state('account activate', {
      url: '/account/activate/:activation_key',
      templateUrl: 'app/account/components/activate/activateAccount.html',
      controller: 'ActivateAccountController',
      controllerAs: 'activateAcctCtrl',
      data: {
        requireLogin: false
      }
    });
}

export default accountRouteConfig;