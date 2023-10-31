import pvfListTemplate from './list/pvfList.html?url';
import './list/pvfList.less';

function PvfRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('pvfList', {
      url: '/pvf?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: pvfListTemplate,
      controller: 'PvfListController',
      controllerAs: 'pvfListCtrl',
    });
}

export default PvfRoutes;