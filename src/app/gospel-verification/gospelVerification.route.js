import gospelVerificationListTemplate from './list/gospelVerificationList.html';
import './list/gospelVerificationList.less';

function GospelVerificationRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('gospelVerificationList', {
      url: '/gospelVerification?search&status&country_ids',
      params: {
        search: { dynamic: true },
        status: { dynamic: true },
        country_ids: { dynamic: true }
      },
      templateUrl: gospelVerificationListTemplate,
      controller: 'GospelVerificationListController',
      controllerAs: 'gospelVerificationListCtrl',
    });
}

export default GospelVerificationRoutes;