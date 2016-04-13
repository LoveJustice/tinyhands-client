/* global toastr:false, moment:false */
import config from './index.config';

import SharedModule from './shared/shared.module';
import budgetModule from './budget/budget.module';
import borderStationModule from './border-station/borderStation.module';
import addressesModule from './addresses/addresses.module';
import dashboardModule from './dashboard/dashboard.module';
import loginModule from './login/login.module'
import VIFModule from './vif/vif.module';
import IRFModule from './irf/irf.module';

import routerConfig from './index.route';
import runBlock from './index.run';
import NavbarDirective from './components/navbar/navbar.directive';

angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap',
  'ngCsv', 'tinyhands.Shared', 'tinyhands.Budget', 'tinyhands.BorderStation', 'tinyhands.Addresses',
  'tinyhands.Dashboard',  'tinyhands.Login', 'tinyhands.VIF', 'tinyhands.IRF'])
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .directive('navbar', () => new NavbarDirective());
;
