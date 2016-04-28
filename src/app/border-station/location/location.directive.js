import LocationController from './location.controller';

export default function LocationDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/border-station/location/location.html',
        controller: LocationController,
        controllerAs: 'locationCtrl'
    };

    return directive;
}