import cifListTemplate from './list/cifList.html';
import './list/cifList.less';

function CifRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('cifList', {
      url: '/cif?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: cifListTemplate,
      controller: 'CifListController',
      controllerAs: 'cifListCtrl',
    });
}

export default CifRoutes;