import LocationController from './location.controller';
import locationTemplate from './location.html';

export default function LocationDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: locationTemplate,
        controller: LocationController,
        controllerAs: 'locationCtrl'
    };

    return directive;
}