import traffickermatchListTemplate from './traffickermatch.html';


function traffickermatchRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('traffickermatch', {
            url: '/traffickermatch',
            templateUrl: traffickermatchListTemplate,
            controller: 'TraffickerMatchController',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_person_match'],
                hideNavbar: true
            },
        });
}

export default traffickermatchRouteConfig;