import personManagementTemplate from './personManagement.html';
import personManagementListTemplate from './list/personManagementList.html';
import personManagementPendingListTemplate from './pending-list/personManagementPendingList.html';
import personManagementPendingFaceMatchesListTemplate from './pending-face-matches-list/personManagementPendingFaceMatchesList.html';

function PersonManagementRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('personManagementList', {
      url: '/PersonManagementList?search&status&country_ids',
      params: {
        search: { dynamic: true },
      },
      templateUrl: personManagementListTemplate,
      controller: 'PersonManagementListController',
      controllerAs: 'vm',
    })
    .state('personManagementPendingList', {
      url: '/PersonManagementPendingList?search&status&country_ids&pending',
      params: {
        search: { dynamic: true },
      },
      templateUrl: personManagementPendingListTemplate,
      controller: 'PersonManagementPendingListController',
      controllerAs: 'vm',
    })
    .state('personManagementPendingFaceMatchesList', {
        url: '/PersonManagementPendingFaceMatchesList?search&status&country_ids&pending',
        params: {
            search: { dynamic: true },
        },
        templateUrl: personManagementPendingFaceMatchesListTemplate,
        controller: 'PersonManagementPendingFaceMatchesListController',
        controllerAs: 'vm',
    })
    .state('personManagement', {
      url: '/PersonManagement?id',
      params: {
        id: null
      },
      templateUrl: personManagementTemplate,
      controller: 'PersonManagementController',
      controllerAs: 'vm',
    });
}

export default PersonManagementRoutes;