function addressesRouteConfig($stateProvider, RequireLogin) {
    'ngInject';
    $stateProvider
        .state('address1', {
            url: '/address1?deleteId',
            templateUrl: 'app/addresses/address1/address1.html',
            controller: 'Address1Controller',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_address2_manage']
            },
            resolve: {
                requireLogin: RequireLogin
            }
        })
        .state('address2', {
            url: '/address2?deleteId',
            templateUrl: 'app/addresses/address2/address2.html',
            controller: 'Address2Controller',
            controllerAs: 'vm',
            data: {
                permissions_required: ['permission_address2_manage']
            },
            resolve: {
                requireLogin: RequireLogin
            }
        });
}

export default addressesRouteConfig;
