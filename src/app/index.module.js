/* jshint ignore:start */
import SharedModule from './shared/shared.module';
import accountModule from './account/account.module';
import budgetModule from './budget/budget.module';
import borderStationModule from './border-station/borderStation.module';
import addressesModule from './addresses/addresses.module';
import dashboardModule from './dashboard/dashboard.module';
import loginModule from './login/login.module';
import VIFModule from './vif/vif.module';
import IRFModule from './irf/irf.module';
import EventsModule from './events/events.module';
import PhotoExportModule from './components/photo-export/photo-export.module';
import CountriesModule from './countries/countries.module';
/* jshint ignore:end */

import constants from './constants.js';
import config from './index.config';
import routerConfig from './index.route';
import httpProviderConfig from './httpProvider.config';

import NavbarDirective from './components/navbar/navbar.directive';
import CsvExportDirective from './components/csv-export/csv-export.directive';
import AutocompleteAddress1Directive from './components/auto-complete/address1/autocomplete-address1.directive';
import AutocompleteAddress2Directive from './components/auto-complete/address2/autocomplete-address2.directive';

angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngCsv', 'ngResource', 'ngSanitize', 'ngTouch', 'ui.bootstrap', 'ui.router',
    'tinyhands.Account',
    'tinyhands.Addresses',
    'tinyhands.BorderStation',
    'tinyhands.Budget',
    'tinyhands.Dashboard',
    'tinyhands.Events',
    'tinyhands.IRF',
    'tinyhands.Login',
    'tinyhands.VIF',
    'tinyhands.PhotoExport',
    'tinyhands.Countries',
])

    .constant('constants', constants)

    .config(config)
    .config(httpProviderConfig)
    .config(routerConfig)

    .directive('csvexport', CsvExportDirective)
    .directive('navbar', NavbarDirective)
    .directive('autocompleteAddress1', AutocompleteAddress1Directive)
    .directive('autocompleteAddress2', AutocompleteAddress2Directive);
