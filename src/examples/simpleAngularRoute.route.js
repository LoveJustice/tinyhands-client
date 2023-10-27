function SimpleAngularRouteConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('simpleAngularPage', {
      url: '/simple-angular-page?id',
      component: 'simpleAngularPage',
      params: {
        id: null
      }
    })
}

export default SimpleAngularRouteConfig;