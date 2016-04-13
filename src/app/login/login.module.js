import loginRouteConfig from './login.route';

import LoginController from './login.controller';

export default angular.module('tinyhands.Login', ['ui.router', 'tinyhands.Shared'])
  .config(loginRouteConfig)

  .controller('LoginController', LoginController);