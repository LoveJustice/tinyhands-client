import personManagementTemplate from './personManagement.html';
import personManagementListTemplate from './list/personManagementList.html';
import personManagementPendingListTemplate from './pending-list/personManagementPendingList.html';
import faceMatchingTemplate from './face-matching/faceMatching.html';
import faceMatchingResultsTemplate from './face-matching/matching-results/faceMatchingResults.html';

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
    .state('faceMatching', {
        url: '/FaceMatching?search&status&country_ids',
        params: {
            search: { dynamic: true },
        },
        templateUrl: faceMatchingTemplate,
        controller: 'FaceMatchingController',
        controllerAs: 'vm',
    })
    .state('faceMatchingResults', {
        url: '/FaceMatchingResults',
        params: {
            search: { dynamic: true },
        },
        templateUrl: faceMatchingResultsTemplate,
        controller: 'FaceMatchingResultsController',
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
