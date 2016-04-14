/* global toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';

import googleMapsConfig from './components/map/map.config';

import runBlock from './index.run';

// REGION: Services
import AccountService from './account/account.service';
import Address1Service from './addresses/address1.service';
import Address2Service from './addresses/address2.service';
import BorderStationService from './border-station/borderStation.service';
import BudgetListService from './budget/list/budgetList.service';
import BudgetService from './budget/form/budget.service';
import EventService from './events/events.service';
import IrfListService from './irf/list/irfList.service';
import IrfService from './irf/form/irf.service';
import SessionService from './utils/session.service';
import TallyService from './components/tally/tally.service';
import VifService from './vif/form/vif.service';
import VifListService from './vif/list/vifList.service';
import PermissionsSetsService from './account/permissionsSets.service';
// ENDREGION: Services

// REGION: Directives
import AnswerDirective from './components/answer/answer.directive';
import DetailDirective from './border-station/detail/detail.directive';
import FlagDirective from './components/flag/flag.directive';
import GreenLightDirective from './components/greenLight/greenLight.directive';
import LocationDirective from './border-station/location/location.directive';
import MapDirective from './components/map/map.directive';
import MathOperator from './components/mathOperator/mathOperator.directive';
import NavbarDirective from './components/navbar/navbar.directive';
import PersonDirective from './border-station/person/person.directive';
import TallyDirective from './components/tally/tally.directive';
import VerticalWordDirective from './components/verticalWord/verticalWord.directive';
// ENDREGION: Directives

// REGION: Controllers
import ActivateAccountController from './account/components/activate/activateAccount.controller.js'
import AccountController from './account/account.controller';
import AccountEditController from './account/components/edit/accountEdit.controller';
import Address1Controller from './addresses/address1.controller';
import Address1EditModalController from './addresses/address1EditModal.controller';
import Address2Controller from './addresses/address2.controller';
import Address2EditModalController from './addresses/address2EditModal.controller';
import BorderStationController from './border-station/borderStation.controller';
import BudgetAdministrationFormController from './budget/form/components/administration/administrationForm.controller';
import BudgetAwarenessFormController from './budget/form/components/awareness/awarenessForm.controller';
import BudgetCommunicationFormController from './budget/form/components/communication/communicationForm.controller';
import BudgetController from './budget/form/budget.controller';
import BudgetFoodAndGasFormController from './budget/form/components/foodAndGas/foodAndGasForm.controller';
import BudgetListController from './budget/list/budgetList.controller';
import BudgetMiscellaneousFormController from './budget/form/components/miscellaneous/miscellaneousForm.controller';
import BudgetSalariesController from './budget/form/components/salaries/salariesForm.controller';
import BudgetShelterFormController from './budget/form/components/shelter/shelterForm.controller';
import BudgetSuppliesFormController from './budget/form/components/supplies/suppliesForm.controller';
import BudgetTravelFormController from './budget/form/components/travel/travelForm.controller';
import EventsModalListController from './events/list/modalCtrl';
import EventsListController from './events/list/eventsCtrl';
import EventsEditFormController from './events/form/editEventCtrl';
import EventsCalendarController from './events/calendar/eventCalendarCtrl';
import EventsModalCalendarController from './events/calendar/eventModalCtrl';

import DashboardController from './dashboard/dashboard.controller';
import IrfController from './irf/form/irf.controller';
import IrfListController from './irf/list/irfList.controller';
import LoginController from './login/login.controller';
import TallyController from './components/tally/tally.controller';
import VifController from './vif/form/vif.controller';
import VifListController from './vif/list/vifList.controller';
import UnsavedChangesModalController from './account/components/modal/unsavedChangesModal.controller.js'
// ENDREGION: Controllers


angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngCsv', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps'])
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)

  .config(routerConfig)

  .config(googleMapsConfig) // Pass google maps config

  .run(runBlock)

  // REGION: Services
  .service('AccountService', AccountService)
  .service('address1Service', Address1Service)
  .service('address2Service', Address2Service)
  .service('BorderStationService', BorderStationService)
  .service('BudgetListService', BudgetListService)
  .service('BudgetService', BudgetService)
  .service('EventService', EventService)
  .service('IrfListService', IrfListService)
  .service('IrfService', IrfService)
  .service('session', SessionService)
  .service('tallyService', TallyService)
  .service('PermissionsSetsService', PermissionsSetsService)
  .service('VifListService', VifListService)
  .service('VifService', VifService)
  // ENDREGION: Services

  // REGION: Directives
  .directive('answer', () => new AnswerDirective())
  .directive('borderStationDetail', () => new DetailDirective())
  .directive('borderStationLocation', () => new LocationDirective())
  .directive('borderStationPerson', () => new PersonDirective())
  .directive('flag', () => new FlagDirective())
  .directive('googlemap', () => new MapDirective())
  .directive('greenLight', () => new GreenLightDirective())
  .directive('navbar', () => new NavbarDirective())
  .directive('operator', () => new MathOperator())
  .directive('tally', () => new TallyDirective())
  .directive('verticalWord', () => new VerticalWordDirective())
  // ENDREGION: Directives

  // REGION: Controllers
  .controller('ActivateAccountController', ActivateAccountController)
  .controller('AccountController', AccountController)
  .controller('AccountEditController', AccountEditController)
  .controller('Address1Controller', Address1Controller)
  .controller('Address1EditModalController', Address1EditModalController)
  .controller('Address2Controller', Address2Controller)
  .controller('Address2EditModalController', Address2EditModalController)
  .controller('BorderStationController', BorderStationController)
  .controller('BudgetAdministrationFormController', BudgetAdministrationFormController)
  .controller('BudgetAwarenessFormController', BudgetAwarenessFormController)
  .controller('BudgetCommunicationFormController', BudgetCommunicationFormController)
  .controller('BudgetController', BudgetController)
  .controller('BudgetFoodAndGasFormController', BudgetFoodAndGasFormController)
  .controller('BudgetListController', BudgetListController)
  .controller('BudgetMiscellaneousFormController', BudgetMiscellaneousFormController)
  .controller('BudgetSalariesController', BudgetSalariesController)
  .controller('BudgetShelterFormController', BudgetShelterFormController)
  .controller('BudgetSuppliesFormController', BudgetSuppliesFormController)
  .controller('BudgetTravelFormController', BudgetTravelFormController)
  .controller('EventsModalListController', EventsModalListController)
  .controller('EventsListController', EventsListController)
  .controller('EventsEditFormController', EventsEditFormController)
  .controller('EventsCalendarController', EventsCalendarController)
  .controller('EventsModalCalendarController', EventsModalCalendarController)
  .controller('DashboardController', DashboardController)
  .controller('IrfController', IrfController)
  .controller('IrfListController', IrfListController)
  .controller('LoginController', LoginController)
  .controller('UnsavedChangesModalController', UnsavedChangesModalController)
  .controller('TallyController', TallyController)
  .controller('VifController', VifController)
  .controller('VifListController', VifListController)
  // ENDREGION: Controllers
;
