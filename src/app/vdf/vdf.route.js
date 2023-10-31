import vdfListTemplate from './list/vdfList.html?url';
import './list/vdfList.less';

function VdfRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('vdfList', {
      url: '/vdf?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: vdfListTemplate,
      controller: 'VdfListController',
      controllerAs: 'vdfListCtrl',
    });
}

export default VdfRoutes;