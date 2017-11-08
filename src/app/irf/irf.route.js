import irfListTemplate from './list/irfList.html';
import './list/irfList.less';

function IRFRoutes($stateProvider) {
    'ngInject';
  $stateProvider
    .state('irfList', {
      url: '/irf?search',
      templateUrl: irfListTemplate,
      controller: 'IrfListController',
      controllerAs: 'irfListCtrl',
    });
}

export default IRFRoutes;
