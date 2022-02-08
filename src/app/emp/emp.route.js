import empListTemplate from './list/empList.html';
import './list/empList.less';
import empTemplate from './emp.html';

function EmpRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('empList', {
      url: '/emp?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: empListTemplate,
      controller: 'EmpListController',
      controllerAs: 'empListCtrl',
    })
    .state('emp', {
            url: '/emp/:?id&stationId&isViewing',
            templateUrl: empTemplate,
            controller: 'EmpController',
            controllerAs: 'vm',
            params: {
                id: null
            }
        });
}

export default EmpRoutes;