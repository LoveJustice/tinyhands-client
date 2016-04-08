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
    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'login',
      data: {
        requireLogin: false
      }
    });

  $urlRouterProvider.otherwise('/');
}

export default routerConfig;
