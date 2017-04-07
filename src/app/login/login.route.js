import loginTemplate from './login.html';
import passwordResetTemplate from './password-reset/password-reset.html';

function loginRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: loginTemplate,
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .state('password-reset', {
            url: '/password-reset',
            templateUrl: passwordResetTemplate,
            controller: 'PasswordResetController',
            controllerAs: 'pwReset',
        });
}

export default loginRouteConfig;