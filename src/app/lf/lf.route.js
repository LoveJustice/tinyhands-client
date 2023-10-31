import lfListTemplate from './list/lfList.html?url';
import './list/lfList.less';

function LfRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('lfList', {
      url: '/lf?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: lfListTemplate,
      controller: 'LfListController',
      controllerAs: 'lfListCtrl',
    });
}

export default LfRoutes;