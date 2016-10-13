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
        })
        .state('password-reset', {
          url: '/password-reset',
          templateUrl: 'app/login/password-reset/password-reset.html',
          controller: 'PasswordResetController',
          controllerAs: 'pwReset',
          data: {
            requireLogin: false
          }
        });
}

export default loginRouteConfig;
