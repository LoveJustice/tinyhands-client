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
    });
}

export default IRFRoutes;