import BorderStationService from './borderStation.service';
import BorderStationController from './borderStation.controller';
import borderStationRouteConfig from './borderStation.route';

import DetailDirective from './detail/detail.directive';
import LocationDirective from './location/location.directive';
import PersonDirective from './person/person.directive';

export default angular.module('tinyhands.BorderStation', ['ui.router', 'tinyhands.Shared'])
    .config(borderStationRouteConfig)
    .service('BorderStationService', BorderStationService)
    .directive('borderStationDetail', DetailDirective)
    .directive('borderStationLocation',LocationDirective)
    .directive('borderStationPerson', PersonDirective)
    .controller('BorderStationController', BorderStationController);