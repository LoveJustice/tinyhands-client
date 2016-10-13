import dashboardRouteConfig from './dashboard.route';
import googleMapsConfig from './map/map.config';

import DashboardController from './dashboard.controller';
import TallyController from './tally/tally.controller';
import DashboardEventsController from './events/dashboardEvents.controller';

import MapDirective from './map/map.directive';
import TallyDirective from './tally/tally.directive';
import DashboardEventsDirective from './events/dashboardEvents.directive';


import TallyService from './tally/tally.service';

export default angular.module('tinyhands.Dashboard', ['uiGmapgoogle-maps', 'ui.router', 'tinyhands.Shared', 'tinyhands.Events'])
    .config(dashboardRouteConfig)
    .config(googleMapsConfig) // Pass google maps config

    .controller('DashboardController', DashboardController)
    .controller('DashboardEventsController', DashboardEventsController)
    .controller('TallyController', TallyController)

    .directive('googlemap', MapDirective)
    .directive('tally', TallyDirective)
    .directive('dashevents', DashboardEventsDirective)

    .service('TallyService', TallyService);
