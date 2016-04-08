import SharedModule from '../shared/shared.module';

import DashboardController from './dashboard.controller';
import dashboardRouteConfig from './dashboard.route';

export default angular.module('tinyhands.Dashboard', ['ui.router', 'tinyhands.Shared'])
    .config(dashboardRouteConfig)
    .controller('DashboardController', DashboardController);