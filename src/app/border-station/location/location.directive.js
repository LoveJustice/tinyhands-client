import LocationController from './location.controller';

class LocationDirective {
	constructor () {
		'ngInject';
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/border-station/location/location.html',
			controller: LocationController,
			controllerAs: 'locationCtrl'
		};
		
		return directive;
	}
}

export default LocationDirective;