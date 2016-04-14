function dashboardRouteConfig ($stateProvider) {
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
        });
}

export default dashboardRouteConfig;