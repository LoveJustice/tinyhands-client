import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngCsv from 'ng-csv';
import ngSanitize from 'angular-sanitize';
import ngTouch from 'angular-touch';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from 'angular-ui-router';
import 'toastr/toastr.less';

import sharedModule from './shared/shared.module';
import accountModule from './account/account.module';
import budgetModule from './budget/budget.module';
import borderStationModule from './border-station/borderStation.module';
import addressesModule from './addresses/addresses.module';
import knownpersonModule from './knownperson/knownperson.module';
import dashboardModule from './dashboard/dashboard.module';
import loginModule from './login/login.module';
import VIFModule from './vif/vif.module';
import IRFModule from './irf/irf.module';
import eventsModule from './events/events.module';
import photoExportModule from './components/photo-export/photo-export.module';
import countriesModule from './countries/countries.module';
import idmanagementModule from './idmanagement/idmanagement.module';

import constants from './constants.js';
import config from './index.config';
import routerConfig from './index.route';
import httpProviderConfig from './httpProvider.config';

import NavbarDirective from './components/navbar/navbar.directive';
import CsvExportDirective from './components/csv-export/csv-export.directive';
import AutocompleteAddress1Directive from './components/auto-complete/address1/autocomplete-address1.directive';
import AutocompleteAddress2Directive from './components/auto-complete/address2/autocomplete-address2.directive';

angular.module('tinyhandsFrontend', [ngAnimate, ngCookies, ngCsv, ngSanitize, ngTouch, uiBootstrap, uiRouter,
    sharedModule,
    accountModule,
    addressesModule,
    knownpersonModule,
    borderStationModule,
    budgetModule,
    dashboardModule,
    eventsModule,
    IRFModule,
    loginModule,
    VIFModule,
    photoExportModule,
    countriesModule,
    idmanagementModule,
])

    .constant('constants', constants)

    .config(config)
    .config(httpProviderConfig)
    .config(routerConfig)

    .directive('csvexport', CsvExportDirective)
    .directive('navbar', NavbarDirective)
    .directive('autocompleteAddress1', AutocompleteAddress1Directive)
    .directive('autocompleteAddress2', AutocompleteAddress2Directive);
