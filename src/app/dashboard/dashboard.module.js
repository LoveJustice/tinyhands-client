import ngMap from 'ngmap';
import eventsModule from '../events/events.module';
import sharedModule from '../shared/shared.module';

import dashboardRouteConfig from './dashboard.route';

import DashboardController from './dashboard.controller';
import TallyController from './tally/tally.controller';
import DashboardEventsController from './events/dashboardEvents.controller';

import MapDirective from './map/map.directive';
import TallyDirective from './tally/tally.directive';
import DashboardEventsDirective from './events/dashboardEvents.directive';


import TallyService from './tally/tally.service';

export default angular.module('tinyhands.Dashboard', [ngMap, eventsModule, sharedModule])
    .config(dashboardRouteConfig)

    .controller('DashboardController', DashboardController)
    .controller('DashboardEventsController', DashboardEventsController)
    .controller('TallyController', TallyController)

    .directive('googlemap', MapDirective)
    .directive('tally', TallyDirective)
    .directive('dashevents', DashboardEventsDirective)

    .service('TallyService', TallyService)
    .name;
