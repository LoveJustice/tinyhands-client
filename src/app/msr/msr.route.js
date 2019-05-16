import msrListTemplate from './list/msrList.html';
import './list/msrList.less';

function MsrRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('msrList', {
      url: '/msr?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: msrListTemplate,
      controller: 'MsrListController',
      controllerAs: 'msrListCtrl',
    });
}

export default MsrRoutes;