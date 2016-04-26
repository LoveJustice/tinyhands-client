function borderStationRouteConfig ($stateProvider) {
    'ngInject';
    $stateProvider
        .state('border-station', {
          url: '/border-station/:id',
          templateUrl: 'app/border-station/borderStation.html',
          controller: 'BorderStationController',
          controllerAs: 'bsCtrl',
          data: {
            requireLogin: true
          }
        });
}

export default borderStationRouteConfig;