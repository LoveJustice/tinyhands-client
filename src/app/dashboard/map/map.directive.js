import MapController from './map.controller.js';
import mapTemplate from './map.html';
import './map.less';

export default function MapDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: mapTemplate,
        controller: MapController,
        controllerAs: 'map'
    };

    return directive;
}