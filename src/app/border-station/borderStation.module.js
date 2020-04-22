import sharedModule from '../shared/shared.module';

import borderStationRouteConfig from './borderStation.route';
import BorderStationService from './borderStation.service.js';
import BorderStationComponent from './borderStation.component';

export default angular.module('tinyhands.BorderStation', [sharedModule])
    .config(borderStationRouteConfig)
    .component('borderStationComponent', BorderStationComponent)
    .service('BorderStationService', BorderStationService)
    .name;
