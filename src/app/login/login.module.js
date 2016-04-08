import SharedModule from '../shared/shared.module';

import LoginController from './login.controller';
import loginRouteConfig from './login.route';

export default angular.module('tinyhands.Login', ['ui.router', 'tinyhands.Shared'])
    .config(loginRouteConfig)
    .controller('LoginController', LoginController);