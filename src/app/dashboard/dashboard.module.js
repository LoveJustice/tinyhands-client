import DashboardController from './dashboard.controller';
import dashboardRouteConfig from './dashboard.route';

import googleMapsConfig from './map/map.config';
import MapDirective from './map/map.directive';

import TallyService from './tally/tally.service';
import TallyDirective from './tally/tally.directive';
import TallyController from './tally/tally.controller';

export default angular.module('tinyhands.Dashboard', ['uiGmapgoogle-maps', 'ui.router', 'tinyhands.Shared'])
    .config(dashboardRouteConfig)
    .config(googleMapsConfig) // Pass google maps config
        
    .service('TallyService', TallyService)
    
    .directive('googlemap', MapDirective)    
    .directive('tally', TallyDirective)
    
    .controller('TallyController', TallyController)
    .controller('DashboardController', DashboardController);