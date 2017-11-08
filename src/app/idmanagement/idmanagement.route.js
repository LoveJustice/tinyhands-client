import idmanagementListTemplate from './idmanagement.html';

function idmanagementRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('idmanagement', {
            url: '/idmanagement',
            templateUrl: idmanagementListTemplate,
            controller: 'IdManagementController',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_address2_manage']
            },
        });
}

export default idmanagementRouteConfig;