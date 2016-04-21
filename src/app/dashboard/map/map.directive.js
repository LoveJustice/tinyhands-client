import MapController from './map.controller.js';

class MapDirective {
	constructor () {
		'ngInject';
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/dashboard/map/map.html',
			controller: MapController,
			controllerAs: 'map'
		};
		
		return directive;
	}
}


export default MapDirective;