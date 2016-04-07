/* global toastr:false, moment:false */
import config from './index.config';

import budgetModule from './budget/budget.module'

import routerConfig from './index.route';

import googleMapsConfig from './components/map/map.config';

import runBlock from './index.run';

// REGION: Services
import Address1Service from './addresses/address1.service';
import Address2Service from './addresses/address2.service';
import BorderStationService from './border-station/borderStation.service';
import IrfListService from './irf/list/irfList.service';
import SessionService from './utils/session.service';
import TallyService from './components/tally/tally.service';
import VifService from './vif/form/vif.service';
import VifListService from './vif/list/vifList.service';
// ENDREGION: Services

// REGION: Directives
import DetailDirective from './border-station/detail/detail.directive';
import LocationDirective from './border-station/location/location.directive';
import MapDirective from './components/map/map.directive';
import MathOperator from './components/mathOperator/mathOperator.directive';
import NavbarDirective from './components/navbar/navbar.directive';
import PersonDirective from './border-station/person/person.directive';
import TallyDirective from './components/tally/tally.directive';
// ENDREGION: Directives

// REGION: Controllers
import Address1Controller from './addresses/address1.controller';
import Address1EditModalController from './addresses/address1EditModal.controller';
import Address2Controller from './addresses/address2.controller';
import Address2EditModalController from './addresses/address2EditModal.controller';
import BorderStationController from './border-station/borderStation.controller';
import DashboardController from './dashboard/dashboard.controller';
import IrfListController from './irf/list/irfList.controller';
import LoginController from './login/login.controller';
import TallyController from './components/tally/tally.controller';
import VifController from './vif/form/vif.controller';
import VifListController from './vif/list/vifList.controller';
// ENDREGION: Controllers



angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps', 'ngCsv', 'tinyhands.Budget'])
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)

  .config(routerConfig)

  .config(googleMapsConfig) // Pass google maps config

  .run(runBlock)

  // REGION: Services
  .service('address1Service', Address1Service)
  .service('address2Service', Address2Service)
  .service('BorderStationService', BorderStationService)
  .service('session', SessionService)
  .service('tallyService', TallyService)
  .service('VifListService', VifListService)
  .service('VifService', VifService)
  // ENDREGION: Services

  // REGION: Directives
  .directive('borderStationDetail', () => new DetailDirective())
  .directive('borderStationLocation', () => new LocationDirective())
  .directive('borderStationPerson', () => new PersonDirective())
  .directive('googlemap', () => new MapDirective())
  .directive('navbar', () => new NavbarDirective())
  .directive('operator', () => new MathOperator())
  .directive('tally', () => new TallyDirective())
  // ENDREGION: Directives

  // REGION: Controllers
  .controller('Address1Controller', Address1Controller)
  .controller('Address1EditModalController', Address1EditModalController)
  .controller('Address2Controller', Address2Controller)
  .controller('Address2EditModalController', Address2EditModalController)
  .controller('BorderStationController', BorderStationController)
  .controller('DashboardController', DashboardController)
  .controller('IrfListController', IrfListController)
  .controller('LoginController', LoginController)
  .controller('TallyController', TallyController)
  .controller('VifController', VifController)
  .controller('VifListController', VifListController)
  // ENDREGION: Controllers
;
