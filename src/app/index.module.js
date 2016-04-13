/* global toastr:false, moment:false */
/* jshint ignore:start */
import SharedModule from './shared/shared.module';
import budgetModule from './budget/budget.module';
import borderStationModule from './border-station/borderStation.module';
import addressesModule from './addresses/addresses.module';
import dashboardModule from './dashboard/dashboard.module';
import loginModule from './login/login.module';
import VIFModule from './vif/vif.module';
import IRFModule from './irf/irf.module';
/* jshint ignore:end */

import config from './index.config';
import routerConfig from './index.route';
import runBlock from './index.run';

import NavbarDirective from './components/navbar/navbar.directive';


angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngCsv', 'ngSanitize', 'ngTouch',
    'tinyhands.Addresses', 'tinyhands.BorderStation', 'tinyhands.Budget', 'tinyhands.Dashboard', 'tinyhands.IRF', 'tinyhands.Login', 'tinyhands.VIF',
    'ui.bootstrap', 'ui.router'])
    .constant('toastr', toastr)
    .constant('moment', moment)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .directive('navbar', NavbarDirective);
