import borderStationRouteConfig from './borderStation.route';

import BorderStationController from './borderStation.controller';

import DetailDirective from './detail/detail.directive';
import LocationDirective from './location/location.directive';
import PersonDirective from './person/person.directive';

import BorderStationService from './borderStation.service';

export default angular.module('tinyhands.BorderStation', ['ui.router', 'tinyhands.Shared'])
    .config(borderStationRouteConfig)

    .controller('BorderStationController', BorderStationController)

    .directive('borderStationDetail', DetailDirective)
    .directive('borderStationLocation', LocationDirective)
    .directive('borderStationPerson', PersonDirective)

    .service('BorderStationService', BorderStationService);