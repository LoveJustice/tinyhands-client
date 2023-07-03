import projectRequestListTemplate from './list/projectRequestList.html';
import inputRequestsTemplate from './inputProjectRequests.html';
import reviewRequestTemplate from './reviewProjectRequest.html';

function PvfRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('projectRequestList', {
      url: '/projectRequest',
      params: {
      },
      templateUrl: projectRequestListTemplate,
      controller: 'ProjectRequestListController',
      controllerAs: '$ctrl',
    })
    .state('inputProjectRequests', {
      url: '/inputProjectRequests?id&name&mdfProject',
      params: {
      },
      templateUrl: inputRequestsTemplate,
      controller: 'InputProjectRequestController',
      controllerAs: '$ctrl',
    })
    .state('reviewProjectRequest', {
      url: '/reviewProjectRequest?id&mdf_id',
      params: {
      },
      templateUrl: reviewRequestTemplate,
      controller: 'ReviewProjectRequestController',
      controllerAs: '$ctrl',
    });
    
    
}

export default PvfRoutes;