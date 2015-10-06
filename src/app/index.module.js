/* global toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';

import googleMapsConfig from './components/map/map.config';

import runBlock from './index.run';

// REGION: Services
import SessionService from './utils/session.service';
// ENDREGION: Services

// REGION: Directives
import MapDirective from './components/map/map.directive';
import NavbarDirective from './components/navbar/navbar.directive';
// ENDREGION: Directives
  
// REGION: Controllers
import DashboardController from './dashboard/dashboard.controller';
import LoginController from './login/login.controller';
// ENDREGION: Controllers

angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps'])
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)

  .config(routerConfig)
  
  .config(googleMapsConfig) // Pass google maps config

  .run(runBlock)
  
  // REGION: Services
  .service('session', SessionService)
  // ENDREGION: Services

  // REGION: Directives
  .directive('navbar', () => new NavbarDirective())
  .directive('googlemap', () => new MapDirective())
  // ENDREGION: Directives
  
  // REGION: Controllers
  .controller('DashboardController', DashboardController)
  .controller('LoginController', LoginController);
  // ENDREGION: Controllers