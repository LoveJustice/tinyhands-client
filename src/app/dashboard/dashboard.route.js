import dashboardTemplate from './dashboard.html';
import './dashboard.less';

function dashboardRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('dashboard', {
            url: '/',
            templateUrl: dashboardTemplate,
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default dashboardRouteConfig;