// React/Angular together
import angularToReactRouterConfig from '../angularToReact.route';
import { SimpleComponent } from '../examples/SimpleComponent';

// ---- Start of old index.module.js ----
import '../app/angularIndex.less';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngCsv from 'ng-csv';
import ngFileUpload from 'ng-file-upload';
import ngSanitize from 'angular-sanitize';
import ngTouch from 'angular-touch';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-chips/dist/angular-chips.min.js';
import 'toastr/toastr.less';

import 'moment/moment.js';
import 'angularjs-bootstrap-datetimepicker/src/js/datetimepicker.js';
import 'angularjs-bootstrap-datetimepicker/src/js/datetimepicker.templates.js';
import 'angular-date-time-input/src/dateTimeInput.js';

import sharedModule from '../app/shared/shared.module';
import accountModule from '../app/account/account.module';
import budgetModule from '../app/budget/budget.module';
import borderStationModule from '../app/border-station/borderStation.module';
import addressesModule from '../app/addresses/addresses.module';
import CIFModule from '../app/cif/cif.module';
import collectionIndicatorsModule from '../app/collectionIndicators/collectionIndicators.module';
import dashboardModule from '../app/dashboard/dashboard.module';
import indicatorsModule from '../app/indicators/indicators.module';
import loginModule from '../app/login/login.module';
import MonthlyReportModule from '../app/monthlyReport/monthlyReport.module';
import VDFModule from '../app/vdf/vdf.module';
import VIFModule from '../app/vif/vif.module';
import IRFModule from '../app/irf/irf.module';
import photoExportModule from '../app/components/photo-export/photo-export.module';
import countriesModule from '../app/countries/countries.module';
import idmanagementModule from '../app/idmanagement/idmanagement.module';
import personManagementModule from '../app/personManagement/personManagement.module';
import traffickermatchModule from '../app/traffickermatch/traffickermatch.module';
import relatedFormsModule from '../app/relatedForms/relatedForms.module';
import helpModule from '../app/help/help.module.js';
import operationsDashboardModule from '../app/operationsDashboard/operationsDashboard.module';
import stationDataModule from '../app/stationData/stationData.module';
import locationDataModule from '../app/location-data/locationData.module';
import locationStaffModule from '../app/location-staff/locationStaff.module';
import auditModule from '../app/audit/audit.module';
import legalCaseModule from '../app/legalCase/legalCase.module';
import gospelVerificationModule from '../app/gospel-verification/gospelVerification.module';
import empModule from '../app/emp/emp.module';
import gspModule from '../app/gsp/gsp.module';
import pvfModule from '../app/pvf/pvf.module';
import sfModule from '../app/sf/sf.module';
import lfModule from '../app/lf/lf.module';
import incidentModule from '../app/incident/incident.module';

import constants from '../app/constants.js';
import httpProviderConfig from '../app/httpProvider.config';
import createAuth0Service from '../app/auth0.service';

import NavbarDirective from '../app/components/navbar/navbar.directive';
import CsvExportDirective from '../app/components/csv-export/csv-export.directive';
import AutocompleteAddress1Directive from '../app/components/auto-complete/address1/autocomplete-address1.directive';
import AutocompleteAddress2Directive from '../app/components/auto-complete/address2/autocomplete-address2.directive';
import CreateButtonComponent from '../app/components/create-budget/create-budget.component.js';
import MdfExportComponent from '../app/components/mdf-export/mdf-export.component';
import AssociatedPersonDirective from '../app/components/associated-person/associated-person.directive';
import AddressEntryDirective from '../app/components/address-entry/address-entry.directive';
import PaginateDirective from '../app/components/paginate/paginate.directive';

import jQuery from "jquery";
import lodash from "lodash";
import { AngularBasePage } from '../angularBasePage.component';
import { AngularRouter } from '../angularRouter.component';

// Global variables
Object.assign(window, { $: jQuery, jQuery });
Object.assign(window, { _: lodash });

angular.module('tinyhandsFrontend', ['angular.chips', ngAnimate, ngCookies, ngCsv, ngFileUpload, ngSanitize, ngTouch, uiBootstrap, 'ui.dateTimeInput', 'ui.bootstrap', 'ui.bootstrap.datetimepicker',
  sharedModule,
  accountModule,
  addressesModule,
  borderStationModule,
  budgetModule,
  collectionIndicatorsModule,
  CIFModule,
  dashboardModule,
  indicatorsModule,
  IRFModule,
  loginModule,
  MonthlyReportModule,
  VDFModule,
  VIFModule,
  photoExportModule,
  countriesModule,
  idmanagementModule,
  personManagementModule,
  traffickermatchModule,
  relatedFormsModule,
  helpModule,
  operationsDashboardModule,
  stationDataModule,
  locationStaffModule,
  locationDataModule,
  auditModule,
  legalCaseModule,
  gospelVerificationModule,
  empModule,
  gspModule,
  pvfModule,
  sfModule,
  lfModule,
  incidentModule,
])
  .constant('constants', constants)

  // .config(config)
  .config(httpProviderConfig)
  // .config(routerConfig)

  .directive('csvexport', CsvExportDirective)
  .directive('navbar', NavbarDirective)
  .directive('addressEntry', AddressEntryDirective)
  .directive('paginate', PaginateDirective)
  .directive('autocompleteAddress1', AutocompleteAddress1Directive)
  .directive('autocompleteAddress2', AutocompleteAddress2Directive)
  .directive('associatedPerson', AssociatedPersonDirective)
  .component('mdfexport', MdfExportComponent)
  .component('createbudget', CreateButtonComponent)

  .factory('auth0Service', [createAuth0Service])
  // ---- End of old module.js, the rest is new React/Angular combined stuff ----
  .config(angularToReactRouterConfig)
  .component('simpleComponent', SimpleComponent)
  .component('angularBasePage', AngularBasePage)
  .component('angularRouter', AngularRouter);

// noinspection TypeScriptValidateTypes
angular.bootstrap(document.getElementById('angular-root'), ['tinyhandsFrontend']);
