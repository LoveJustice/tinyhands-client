import vifListTemplate from './list/vifList.html';
import './list/vifList.less';

function VIFRoutes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('vifList', {
      url: '/vif?search',
      templateUrl: vifListTemplate,
      controller: 'VifListController',
      controllerAs: 'vifListCtrl',
    });
}

export default VIFRoutes;
