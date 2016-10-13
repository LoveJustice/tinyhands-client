function IRFRoutes($stateProvider, RequireLogin) {
  $stateProvider
    .state('irfList', {
      url: '/irf?search',
      templateUrl: 'app/irf/list/irfList.html',
      controller: 'IrfListController',
      controllerAs: 'irfListCtrl',
      resolve: {
        requireLogin: RequireLogin
      }
    });
    /*.state('irf', {
      url: '/irf/:id?isViewing',
      templateUrl: 'app/irf/form/irf.html',
      controller: 'IrfController',
      controllerAs: 'irfCtrl',
      data: {
        requireLogin: true
      }
    });*/
}

export default IRFRoutes;
