/* global toastr:false, moment:false */
import config from './index.config';

import SharedModule from './shared/shared.module';
import budgetModule from './budget/budget.module';
import borderStationModule from './border-station/borderStation.module';
import addressesModule from './addresses/addresses.module';
import navbarModule from './components/navbar/navbar.module'
import tallyModule from './components/tally/tally.module';
import VIFModule from './vif/vif.module';
import IRFModule from './irf/irf.module';

import routerConfig from './index.route';

import googleMapsConfig from './components/map/map.config';

import runBlock from './index.run';

// REGION: Services
import SessionService from './utils/session.service';
// ENDREGION: Services

// REGION: Directives
import MapDirective from './components/map/map.directive';
import MathOperator from './components/mathOperator/mathOperator.directive';
// ENDREGION: Directives

// REGION: Controllers
import DashboardController from './dashboard/dashboard.controller';
import LoginController from './login/login.controller';
// ENDREGION: Controllers

angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap',
  'uiGmapgoogle-maps', 'ngCsv', 'tinyhands.Shared', 'tinyhands.Budget', 'tinyhands.BorderStation',
  'tinyhands.Addresses', 'tinyhands.Navbar', 'tinyhands.Tally', 'tinyhands.VIF', 'tinyhands.IRF'])
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .config(googleMapsConfig) // Pass google maps confi
  .run(runBlock)

  // REGION: Directives
  .directive('googlemap', () => new MapDirective())
  .directive('operator', () => new MathOperator())
  // ENDREGION: Directives

  // REGION: Controllers
  .controller('DashboardController', DashboardController)
  .controller('LoginController', LoginController)
  // ENDREGION: Controllers
;
