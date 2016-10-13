function dashboardRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('dashboard', {
            url: '/',
            templateUrl: 'app/dashboard/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default dashboardRouteConfig;