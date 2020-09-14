import sharedModule from '../shared/shared.module';

import OperationsDashboardController from './operationsDashboard.controller';
import OperationsDashboardRoutes from './operationsDashboard.route';
import OperationsDashboardService from './operationsDashboard.service';

/* global angular */

export default angular.module('tinyhands.OperationsDashboard', [sharedModule])
    .config(OperationsDashboardRoutes)
    .controller('OperationsDashboardController', OperationsDashboardController)
    .service('operationsDashboardService', OperationsDashboardService)
    .name;