function addressesRouteConfig ($stateProvider) {
    'ngInject';
    $stateProvider
        .state('address1', {
          url: '/address1',
          templateUrl: 'app/addresses/address1.html',
          controller: 'Address1Controller',
          controllerAs: 'vm',
          data: {
            requireLogin: true,
            permissions_required: ['permission_address2_manage']
          }
        })
        .state('address2', {
          url: '/address2',
          templateUrl: 'app/addresses/address2.html',
          controller: 'Address2Controller',
          controllerAs: 'vm',
          data: {
            requireLogin: true,
            permissions_required: ['permission_address2_manage']
          }
        });
}

export default addressesRouteConfig;
