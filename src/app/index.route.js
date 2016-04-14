function routerConfig ($locationProvider, $stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('dashboard', {
      url: '/',
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'dashboard',
      data: {
        requireLogin: true
      }
    })
    .state('address1', {
      url: '/address1',
      templateUrl: 'app/addresses/address1.html',
      controller: 'Address1Controller',
      controllerAs: 'vm',
      data: {
        requireLogin: true
      }
    })
    .state('address2', {
      url: '/address2',
      templateUrl: 'app/addresses/address2.html',
      controller: 'Address2Controller',
      controllerAs: 'vm',
      data: {
        requireLogin: true
      }
    })
    .state('border-station', {
      url: '/border-station/:id',
      templateUrl: 'app/border-station/borderStation.html',
      controller: 'BorderStationController',
      controllerAs: 'bsCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('budget', {
      url: '/budget/:id',
      templateUrl: 'app/budget/form/budget.html',
      controller: 'BudgetController',
      controllerAs: 'budgetCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('budgetList', {
      url: '/budget',
      templateUrl: 'app/budget/list/budgetList.html',
      controller: 'BudgetListController',
      controllerAs: 'budgetListCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('events', {
      url: '/events',
      templateUrl: 'app/events/events.html',
      controller: 'EventsController',
      controllerAs: 'events',
      data: {
        requireLogin: true
      }
    })
    .state('irf', {
      url: '/irf/:id',
      templateUrl: 'app/irf/form/irf.html',
      controller: 'IrfController',
      controllerAs: 'irfCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('irfList', {
      url: '/irf',
      templateUrl: 'app/irf/list/irfList.html',
      controller: 'IrfListController',
      controllerAs: 'irfListCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'login',
      data: {
        requireLogin: false
      }
    })
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
    .state('account/activate-account/:code', {
      url: '/account/activate-account/:code',
      templateUrl: 'app/account/components/activate/activateAccount.html',
      controller: 'ActivateAccountController',
      controllerAs: 'activateAcctCtrl',
      data: {
        requireLogin: true
      }
    })

    .state('vifList', {
      url: '/vif',
      templateUrl: 'app/vif/list/vifList.html',
      controller: 'VifListController',
      controllerAs: 'vifListCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif', {
      url: '/vif/create',
      templateUrl: 'app/vif/form/vif.html',
      controller: 'VifController',
      controllerAs: 'vifCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('vifList', {
      url: '/vif',
      templateUrl: 'app/vif/list/vifList.html',
      controller: 'VifListController',
      controllerAs: 'vifListCtrl',
      data: {
        requireLogin: true
      }
    });

  $urlRouterProvider.otherwise('/');
}

export default routerConfig;
