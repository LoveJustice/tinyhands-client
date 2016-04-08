/* global toastr:false, moment:false */
import config from './index.config';

import SharedModule from './shared/shared.module';
import budgetModule from './budget/budget.module';
import borderStationModule from './border-station/borderStation.module';
import addressesModule from './addresses/addresses.module';
import mapModule from './components/map/map.module'
import navbarModule from './components/navbar/navbar.module'
import tallyModule from './components/tally/tally.module';
import dashboardModule from './dashboard/dashboard.module'
import VIFModule from './vif/vif.module';
import IRFModule from './irf/irf.module';

import routerConfig from './index.route';

import runBlock from './index.run';

import SessionService from './utils/session.service';

import MathOperator from './components/mathOperator/mathOperator.directive';

import LoginController from './login/login.controller';

angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap',
  'uiGmapgoogle-maps', 'ngCsv', 'tinyhands.Shared', 'tinyhands.Budget', 'tinyhands.BorderStation',
  'tinyhands.Addresses', 'tinyhands.Map', 'tinyhands.Navbar', 'tinyhands.Tally', 'tinyhands.Dashboard', 'tinyhands.VIF',
  'tinyhands.IRF'])
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)

  .directive('operator', () => new MathOperator())

  .controller('LoginController', LoginController)
;
