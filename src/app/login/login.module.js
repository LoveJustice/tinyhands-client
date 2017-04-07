import uiRouter from 'angular-ui-router';
import sharedModule from '../shared/shared.module';

import loginRouteConfig from './login.route';

import LoginController from './login.controller';
import PasswordResetController from './password-reset/password-reset.controller';

export default angular.module('tinyhands.Login', [uiRouter, sharedModule])
    .config(loginRouteConfig)

    .controller('LoginController', LoginController)
    .controller('PasswordResetController', PasswordResetController)
    .name;
