import vifListTemplate from './list/vifList.html';
import './list/vifList.less';

function VIFRoutes($stateProvider, RequireLogin) {
  'ngInject';
  $stateProvider
    .state('vifList', {
      url: '/vif?search',
      templateUrl: vifListTemplate,
      controller: 'VifListController',
      controllerAs: 'vifListCtrl',
      resolve: {
        requireLogin: RequireLogin
      }
    });
}

export default VIFRoutes;
