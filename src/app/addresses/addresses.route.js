function addressesRouteConfig ($stateProvider) {
    'ngInject';
    $stateProvider
        .state('address1', {
          url: '/address1',
          templateUrl: 'app/addresses/address1.html',
          controller: 'Address1Controller',
          controllerAs: 'vm',
          data: {
            requireLogin: true
          }
        })
        .state('address2', {
          url: '/address2',
          templateUrl: 'app/addresses/address2.html',
          controller: 'Address2Controller',
          controllerAs: 'vm',
          data: {
            requireLogin: true
          }
        });
}

export default addressesRouteConfig;