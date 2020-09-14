import sharedModule from '../shared/shared.module';

import LocationDataController from './locationData.controller';
import LocationDataRoutes from './locationData.route';
import LocationDataService from './locationData.service';

/* global angular */

export default angular.module('tinyhands.LocationData', [sharedModule])
    .config(LocationDataRoutes)
    .controller('LocationDataController', LocationDataController)
    .service('locationDataService', LocationDataService)
    .name;