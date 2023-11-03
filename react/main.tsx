import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

// Library css files
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import ReactRouter from './ReactRouter';
import { RouterProvider } from 'react-router';

// React/Angular together
import { lazyInjector } from './lazyInjector';
import angularToReactRouterConfig from '../src/angularToReact.route';
import { SimpleComponent } from '../src/examples/SimpleComponent';

// ---- Start of old index.module.js ----
import '../src/app/angularIndex.less';

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

import sharedModule from '../src/app/shared/shared.module';
import accountModule from '../src/app/account/account.module';
import budgetModule from '../src/app/budget/budget.module';
import borderStationModule from '../src/app/border-station/borderStation.module';
import addressesModule from '../src/app/addresses/addresses.module';
import CIFModule from '../src/app/cif/cif.module';
import collectionIndicatorsModule from '../src/app/collectionIndicators/collectionIndicators.module';
import dashboardModule from '../src/app/dashboard/dashboard.module';
import indicatorsModule from '../src/app/indicators/indicators.module';
import loginModule from '../src/app/login/login.module';
import MonthlyReportModule from '../src/app/monthlyReport/monthlyReport.module';
import VDFModule from '../src/app/vdf/vdf.module';
import VIFModule from '../src/app/vif/vif.module';
import IRFModule from '../src/app/irf/irf.module';
import photoExportModule from '../src/app/components/photo-export/photo-export.module';
import countriesModule from '../src/app/countries/countries.module';
import idmanagementModule from '../src/app/idmanagement/idmanagement.module';
import personManagementModule from '../src/app/personManagement/personManagement.module';
import traffickermatchModule from '../src/app/traffickermatch/traffickermatch.module';
import relatedFormsModule from '../src/app/relatedForms/relatedForms.module';
import helpModule from '../src/app/help/help.module.js';
import operationsDashboardModule from '../src/app/operationsDashboard/operationsDashboard.module';
import stationDataModule from '../src/app/stationData/stationData.module';
import locationDataModule from '../src/app/location-data/locationData.module';
import locationStaffModule from '../src/app/location-staff/locationStaff.module';
import auditModule from '../src/app/audit/audit.module';
import legalCaseModule from '../src/app/legalCase/legalCase.module';
import gospelVerificationModule from '../src/app/gospel-verification/gospelVerification.module';
import empModule from '../src/app/emp/emp.module';
import gspModule from '../src/app/gsp/gsp.module';
import pvfModule from '../src/app/pvf/pvf.module';
import sfModule from '../src/app/sf/sf.module';
import lfModule from '../src/app/lf/lf.module';
import incidentModule from '../src/app/incident/incident.module';

import constants from '../src/app/constants.js';
import httpProviderConfig from '../src/app/httpProvider.config';
import createAuth0Service from '../src/app/auth0.service';

import NavbarDirective from '../src/app/components/navbar/navbar.directive';
import CsvExportDirective from '../src/app/components/csv-export/csv-export.directive';
import AutocompleteAddress1Directive from '../src/app/components/auto-complete/address1/autocomplete-address1.directive';
import AutocompleteAddress2Directive from '../src/app/components/auto-complete/address2/autocomplete-address2.directive';
import CreateButtonComponent from '../src/app/components/create-budget/create-budget.component.js';
import MdfExportComponent from '../src/app/components/mdf-export/mdf-export.component';
import AssociatedPersonDirective from '../src/app/components/associated-person/associated-person.directive';
import AddressEntryDirective from '../src/app/components/address-entry/address-entry.directive';
import PaginateDirective from '../src/app/components/paginate/paginate.directive';

import jQuery from "jquery";
import lodash from "lodash";
import { AngularBasePage } from '../src/angularBasePage.component';
import { AngularRouter } from '../src/angularRouter.component';

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
  .component('angularRouter', AngularRouter)

  .run(['$injector', function(_$injector) {
    lazyInjector.$injector = _$injector;
    reactBootstrap();
  }]);

// noinspection TypeScriptValidateTypes
angular.bootstrap(document.getElementById('angular-root'), ['tinyhandsFrontend']);

function reactBootstrap() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>

      <RouterProvider router={ReactRouter}/>
    </React.StrictMode>,
  );
}