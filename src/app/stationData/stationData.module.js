import sharedModule from '../shared/shared.module';

import StationDataController from './stationData.controller';
import StationDataRoutes from './stationData.route';
import StationDataService from './stationData.service';

/* global angular */

export default angular.module('tinyhands.StationData', [sharedModule])
    .config(StationDataRoutes)
    .controller('StationDataController', StationDataController)
    .service('stationDataService', StationDataService)
    .name;