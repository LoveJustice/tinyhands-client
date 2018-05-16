import irfNewListTemplate from './list/irfNewList.html';
import './list/irfNewList.less';

function IRFNewRoutes($stateProvider) {
    'ngInject';
  $stateProvider
    .state('irfNewList', {
      url: '/irfNew?search',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: irfNewListTemplate,
      controller: 'IrfNewListController',
      controllerAs: 'irfNewListCtrl',
    });
}

export default IRFNewRoutes;
