import 'angular-google-maps';
import 'angular-simple-logger';
import uiRouter from 'angular-ui-router';
import eventsModule from '../events/events.module';
import sharedModule from '../shared/shared.module';

import dashboardRouteConfig from './dashboard.route';
import googleMapsConfig from './map/map.config';

import DashboardController from './dashboard.controller';
import TallyController from './tally/tally.controller';
import DashboardEventsController from './events/dashboardEvents.controller';

import MapDirective from './map/map.directive';
import TallyDirective from './tally/tally.directive';
import DashboardEventsDirective from './events/dashboardEvents.directive';


import TallyService from './tally/tally.service';

export default angular.module('tinyhands.Dashboard', ['nemLogging', 'uiGmapgoogle-maps', uiRouter, eventsModule, sharedModule])
    .config(dashboardRouteConfig)
    .config(googleMapsConfig) // Pass google maps config

    .controller('DashboardController', DashboardController)
    .controller('DashboardEventsController', DashboardEventsController)
    .controller('TallyController', TallyController)

    .directive('googlemap', MapDirective)
    .directive('tally', TallyDirective)
    .directive('dashevents', DashboardEventsDirective)

    .service('TallyService', TallyService)
    .name;
