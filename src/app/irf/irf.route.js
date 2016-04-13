function IRFRoutes($stateProvider) {
  $stateProvider
    .state('irfList', {
      url: '/irf',
      templateUrl: 'app/irf/list/irfList.html',
      controller: 'IrfListController',
      controllerAs: 'irfListCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('irf', {
      url: '/irf/:id',
      templateUrl: 'app/irf/form/irf.html',
      controller: 'IrfController',
      controllerAs: 'irfCtrl',
      data: {
        requireLogin: true
      }
    });
}

export default IRFRoutes;