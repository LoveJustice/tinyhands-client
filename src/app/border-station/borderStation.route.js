import borderStationListTemplate from './list/borderStationList.html?url';
function borderStationRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('border-station', {
            url: '/border-station/:?id&new_staff',
            component: 'borderStationComponent',
            params: {
                id: null,
                countryId: null
            }
        })
        .state('projectList', {
                url: '/project?search&status&country_ids',
                      templateUrl: borderStationListTemplate,
                      controller: 'BorderStationListController',
                      controllerAs: 'borderStationListCtrl',
            });
}

export default borderStationRouteConfig;