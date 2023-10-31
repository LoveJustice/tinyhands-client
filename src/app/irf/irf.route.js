import irfListTemplate from './list/irfList.html?url';
import './list/irfList.less';
import irfNewListTemplate from './newList/irfNewList.html?url';
import './newList/irfNewList.less';

function IrfRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('irfList', {
            url: '/irf?search',
            params: {
                search: {
                    dynamic: true
                }
            },
            templateUrl: irfListTemplate,
            controller: 'IrfListController',
            controllerAs: 'irfListCtrl',
        });
    $stateProvider
    .state('irfNewList', {
      url: '/irfNew?search&status&country_ids',
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

export default IrfRoutes;