function loginRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .state('password-reset', {
            url: '/password-reset',
            templateUrl: 'app/login/password-reset/password-reset.html',
            controller: 'PasswordResetController',
            controllerAs: 'pwReset',
        });
}

export default loginRouteConfig;