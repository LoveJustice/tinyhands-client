function VIFRoutes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('vifList', {
      url: '/vif',
      templateUrl: 'app/vif/list/vifList.html',
      controller: 'VifListController',
      controllerAs: 'vifListCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif', {
      url: '/vif/create',
      templateUrl: 'app/vif/form/vif.html',
      controller: 'VifController',
      controllerAs: 'vifCtrl',
      data: {
        requireLogin: true
      }
    });
}

export default VIFRoutes;