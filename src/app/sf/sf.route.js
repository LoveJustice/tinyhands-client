import sfListTemplate from './list/sfList.html';
import './list/sfList.less';

function SfRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('sfList', {
      url: '/sf?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: sfListTemplate,
      controller: 'SfListController',
      controllerAs: 'sfListCtrl',
    });
}

export default SfRoutes;