function accountRouteConfig ($stateProvider) {
  'ngInject';
  $stateProvider
    .state('account', {
          url: '/account/tab=:activeTab',
          templateUrl: 'app/account/account.html',
          data: {
            requireLogin: true
          }
    })

    .state('account/:id', {
      url: '/account/:id',
      templateUrl: 'app/account/account.html',
      data: {
        requireLogin: true
      }
    })

    .state('account/not_found/:id', {
      url: '/account/not_found/:id',
      templateUrl: 'app/account/account.html',
      data: {
        requireLogin: true
      }
    })

    .state('account/activate/:activation_key', {
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