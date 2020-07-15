import operationsDashboardTemplate from './operationsDashboard.html';
import './operationsDashboard.less';

function operationsDashboardRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('operationsDashboard', {
            url: '/operationsDashboard',
            templateUrl: operationsDashboardTemplate,
            controller: 'OperationsDashboardController',
            controllerAs: 'vm',
        });
}

export default operationsDashboardRoutes;