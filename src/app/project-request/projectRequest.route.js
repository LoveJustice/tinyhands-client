import projectRequestListTemplate from './list/projectRequestList.html?url';
import inputRequestsTemplate from './inputProjectRequests.html?url';
import reviewRequestTemplate from './reviewProjectRequest.html?url';

function PvfRoutes($stateProvider) {
    'ngInject';
    $stateProvider
    .state('projectRequestList', {
      url: '/projectRequest?mdf_id',
      params: {
      	mdf_id:null,
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