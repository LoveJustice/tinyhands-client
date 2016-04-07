function VIFRouteConfig($stateProvider) {
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
      abstract: false, //will need to change once a section is started
      url: '/vif/create',
      templateUrl: 'app/vif/form/vif.html',
      controller: 'VifController',
      controllerAs: 'vifCtrl',
      data: {
        requireLogin: true
      }
    });
}

export default VIFRouteConfig;