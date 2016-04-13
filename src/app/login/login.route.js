function loginRouteConfig ($stateProvider) {
    'ngInject';
    $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'app/login/login.html',
          controller: 'LoginController',
          controllerAs: 'login',
          data: {
            requireLogin: false
          }
        });
}

export default loginRouteConfig;