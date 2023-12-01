import sharedModule from '../shared/shared.module';

import borderStationRouteConfig from './borderStation.route';
import BorderStationService from './borderStation.service.js';
import BorderStationComponent from './borderStation.component';

import BorderStationListController from './list/borderStationList.controller';

export default angular.module('tinyhands.BorderStation', [sharedModule])
    .config(borderStationRouteConfig)
    .controller('BorderStationListController', BorderStationListController)
    .component('borderStationComponent', BorderStationComponent)
    .service('BorderStationService', BorderStationService)
    .name;
