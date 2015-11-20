export default class LocationController {
	constructor($scope, BorderStationService) {
		'ngInject';
		
		this.$scope = $scope;
		this.service = BorderStationService;
		
		this.locations = [];
		this.newLocations = [];
		this.removeToLocations = [];
		
		this.activate();
	}
	
	activate() {
		this.$scope.$on('GetBorderStationData',() => { // Create listener
			this.getLocations();
		});
		this.getLocations();
	}
		
	addLocation() {
		var newLocation = {
			border_station: this.service.borderStationId
		};
		this.newLocations.push(newLocation);
		this.locations.push(newLocation);
	}
		
	
	// CREATE calls
	createLocations(locations) {
		return this.service.createRelationship(locations, this.service.createLocation);
	}
		
	
	// GET calls
	getLocations() {
		this.service.getLocations().then((response) => {
			this.locations = response.data.results;
		});
	}
		
		
	// REMOVE calls
	removeLocation(location) {
		if (location.removeConfirmed) {
			this.service.removeRelationship(location, this.newLocations, this.locations, this.removeToLocations);
		} else {
			location.removeConfirmed = true;
		}
	}
		
		
	// UPDATE calls
	updateLocations(locations, removing) {
		if (removing) {
			return this.service.updateRelationship(locations, this.service.updateLocations, 0);
		}
		return this.service.updateRelationship(locations, this.service.updateLocations, this.newLocations.length);
	}
}