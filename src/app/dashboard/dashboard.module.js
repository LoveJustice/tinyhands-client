import dashboardRouteConfig from './dashboard.route';
import googleMapsConfig from './map/map.config';

import DashboardController from './dashboard.controller';
import TallyController from './tally/tally.controller';

import MapDirective from './map/map.directive';
import TallyDirective from './tally/tally.directive';

import TallyService from './tally/tally.service';

export default angular.module('tinyhands.Dashboard', ['uiGmapgoogle-maps', 'ui.router', 'tinyhands.Shared'])
  .config(dashboardRouteConfig)
  .config(googleMapsConfig) // Pass google maps config

  .controller('DashboardController', DashboardController)
  .controller('TallyController', TallyController)

  .directive('googlemap', MapDirective)
  .directive('tally', TallyDirective)

  .service('TallyService', TallyService);