function loginRouteConfig ($stateProvider) {
    'ngInject';
    $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'app/login/login.html',
          controller: 'LoginController',
          controllerAs: 'login'
        });
}

export default loginRouteConfig;