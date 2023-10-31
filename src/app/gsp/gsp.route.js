import gspListTemplate from './list/gspList.html?url';
import './list/gspList.less';
import gspTemplate from './gsp.html?url';

function GspRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('gspList', {
      url: '/gsp?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: gspListTemplate,
      controller: 'GspListController',
      controllerAs: 'gspListCtrl',
    })
    .state('gsp', {
            url: '/gsp/:?id&stationId&isViewing',
            templateUrl: gspTemplate,
            controller: 'GspController',
            controllerAs: 'vm',
            params: {
                id: null
            }
        });
}

export default GspRoutes;