import legalCaseListTemplate from './list/legalCaseList.html?url';
import './list/legalCaseList.less';

function LegalCaseRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('legalCaseList', {
      url: '/legalCase?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: legalCaseListTemplate,
      controller: 'LegalCaseListController',
      controllerAs: 'lcfListCtrl',
    });
}

export default LegalCaseRoutes;