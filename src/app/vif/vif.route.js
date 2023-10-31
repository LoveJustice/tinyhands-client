import vifListTemplate from './list/vifList.html?url';
import './list/vifList.less';

function VIFRoutes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('vifList', {
      url: '/vif?search',
      params: {
        search: { dynamic: true }
      },
      templateUrl: vifListTemplate,
      controller: 'VifListController',
      controllerAs: 'vifListCtrl',
    });
}

export default VIFRoutes;
