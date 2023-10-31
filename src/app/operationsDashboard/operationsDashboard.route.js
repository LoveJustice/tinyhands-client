import operationsDashboardTemplate from './operationsDashboard.html?url';
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