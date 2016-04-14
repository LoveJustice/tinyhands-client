import MapController from './map.controller.js';

export default function MapDirective() {
    'ngInject';
    
    let directive = {
        restrict: 'E',
        templateUrl: 'app/dashboard/map/map.html',
        controller: MapController,
        controllerAs: 'map'
    };
    
    return directive;
}