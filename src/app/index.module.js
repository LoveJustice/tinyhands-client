/* global toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';
import errorRoutes from './error/error.route';

import googleMapsConfig from './components/map/map.config';

import runBlock from './index.run';

// REGION: Services
import AccountService from './account/components/list/account.service';
import Address1Service from './addresses/address1.service';
import Address2Service from './addresses/address2.service';
import BorderStationService from './border-station/borderStation.service';
import SessionService from './utils/session.service';
import TallyService from './components/tally/tally.service';
import PermissionsSetsService from './account/components/list/permissionsSets.service';
// ENDREGION: Services

// REGION: Directives
import DetailDirective from './border-station/detail/detail.directive';
import LocationDirective from './border-station/location/location.directive';
import MapDirective from './components/map/map.directive';
import NavbarDirective from './components/navbar/navbar.directive';
import PersonDirective from './border-station/person/person.directive';
import TallyDirective from './components/tally/tally.directive';
// ENDREGION: Directives

// REGION: Controllers
import AccountController from './account/components/list/account.controller';
import AccountDefaultsController from './account/components/defaults/accountDefaults.controller';
import AccountModalController from './account/components/list/accountModal.controller';
import AccountNavController from './account/accountNav.controller';
import AccountControlController from './account/components/control/accountControl.controller.js';
import Address1Controller from './addresses/address1.controller';
import Address1EditModalController from './addresses/address1EditModal.controller';
import Address2Controller from './addresses/address2.controller';
import Address2EditModalController from './addresses/address2EditModal.controller';
import BorderStationController from './border-station/borderStation.controller';
import BudgetController from './budget/form/budget.controller';
import DashboardController from './dashboard/dashboard.controller';
import LoginController from './login/login.controller';
import UnsavedChangesModalController from './account/components/defaults/unsavedChangesModal.controller.js'
// ENDREGION: Controllers

// REGION: Factories
import ErrorFactory from './error/error.factory';
// ENDREGION: Factories

angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps'])
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)

  .config(routerConfig)
  .config(errorRoutes)

  .config(googleMapsConfig) // Pass google maps config

  .run(runBlock)

  // REGION: Services
  .service('AccountService', AccountService)
  .service('address1Service', Address1Service)
  .service('address2Service', Address2Service)
  .service('BorderStationService', BorderStationService)
  .service('session', SessionService)
  .service('tallyService', TallyService)
  .service('PermissionsSetsService', PermissionsSetsService)
  // ENDREGION: Services

  // REGION: Factories
  .factory('ErrorHandler', ErrorFactory.errorFactory)
  // ENDREGION: Factories

  // REGION: Directives
  .directive('borderStationDetail', () => new DetailDirective())
  .directive('borderStationLocation', () => new LocationDirective())
  .directive('borderStationPerson', () => new PersonDirective())
  .directive('googlemap', () => new MapDirective())
  .directive('navbar', () => new NavbarDirective())
  .directive('tally', () => new TallyDirective())
  // ENDREGION: Directives

  // REGION: Controllers
  .controller('AccountDefaultsController', AccountDefaultsController)
  .controller('AccountController', AccountController)
  .controller('AccountModalController', AccountModalController)
  .controller('AccountNavController', AccountNavController)
  .controller('AccountControlController,' AccountControlController)
  .controller('Address1Controller', Address1Controller)
  .controller('Address2Controller', Address2Controller)
  .controller('Address1EditModalController', Address1EditModalController)
  .controller('Address2EditModalController', Address2EditModalController)
  .controller('BorderStationController', BorderStationController)
  .controller('BudgetController', BudgetController)
  .controller('DashboardController', DashboardController)
  .controller('LoginController', LoginController)
  .controller('UnsavedChangesModalController', UnsavedChangesModalController)
  // ENDREGION: Controllers
;