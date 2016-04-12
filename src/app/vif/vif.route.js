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
      abstract: true,
      url: '/vif',
      templateUrl: 'app/vif/form/vif.html',
      controller: 'VifController',
      controllerAs: 'vifCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.info', {
      url: '/create/info',
      templateUrl: 'app/vif/form/info/info.html',
      controller: 'VifInfoController',
      controllerAs: 'infoCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.section1', {
      url: '/create/1',
      templateUrl: 'app/vif/form/section1/section1.html',
      controller: 'VifSection1Controller',
      controllerAs: 'section1Ctrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.section2', {
      url: '/create/2',
      templateUrl: 'app/vif/form/section2/section2.html',
      controller: 'VifSection2Controller',
      controllerAs: 'section2Ctrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.section3', {
      url: '/create/3',
      templateUrl: 'app/vif/form/section3/section3.html',
      controller: 'VifSection3Controller',
      controllerAs: 'section3Ctrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.section4', {
      url: '/create/4',
      templateUrl: 'app/vif/form/section4/section4.html',
      controller: 'VifSection4Controller',
      controllerAs: 'section4Ctrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.section5', {
      url: '/create/5',
      templateUrl: 'app/vif/form/section5/section5.html',
      controller: 'VifSection5Controller',
      controllerAs: 'section5Ctrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.section6', {
      url: '/create/6',
      templateUrl: 'app/vif/form/section6/section6.html',
      controller: 'VifSection6Controller',
      controllerAs: 'section6Ctrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.section7', {
      url: '/create/7',
      templateUrl: 'app/vif/form/section7/section7.html',
      controller: 'VifSection7Controller',
      controllerAs: 'section7Ctrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.section8', {
      url: '/create/8',
      templateUrl: 'app/vif/form/section8/section8.html',
      controller: 'VifSection8Controller',
      controllerAs: 'section8Ctrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.people', {
      url: '/create/people',
      templateUrl: 'app/vif/form/people/people.html',
      controller: 'VifPeopleController',
      controllerAs: 'peopleCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('vif.locations', {
      url: '/create/locations',
      templateUrl: 'app/vif/form/locations/locations.html',
      controller: 'VifLocationsController',
      controllerAs: 'locationsCtrl',
      data: {
        requireLogin: true
      }
    });
}

export default VIFRoutes;