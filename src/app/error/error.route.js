function errorRoutes ($stateProvider) {
  'ngInject';
  $stateProvider
    .state('error', {
      url: '/error/:errorId',
      templateUrl: (params) => { return 'app/error/' + params.errorId +  '.html'; },
      data: {
        requireLogin: true
      }
    });
}

export default errorRoutes;