import constants from './../constants.js';

export default class LocationController {
	constructor($q, $scope, BorderStationService) {
		'ngInject';
		
		this.$q = $q;
		this.$scope = $scope;
		this.service = BorderStationService;
		
		this.locations = [];
		this.newLocations = [];
		this.removeToLocations = [];
		
		if (this.service.borderStationId) {
			this.getLocations();
		}
		this.createListeners();
	}
	
		
	addLocation() {
		var newLocation = {
			border_station: this.service.borderStationId
		};
		this.newLocations.push(newLocation);
		this.locations.push(newLocation);
	}
		
	
	// CREATE calls
	createLocations() {
		return this.service.createRelationship(this.newLocations, 'createLocation');
	}
	
	
	createListeners() {
		this.$scope.$on(constants.Events.Create.BorderStation.Done,() => { // POST listener
			this.service.setBorderStationIdOfData(this.newLocations);
			this.service.setBorderStationIdOfData(this.locations);
			this.update();
		});
		this.$scope.$on(constants.Events.Get.BorderStation,() => { // GET listener
			this.getLocations();
		});
		this.$scope.$on(constants.Events.Update.BorderStation, () => { // UPDATE listener
			this.update();
		});
	}
		
	
	// GET call
	getLocations() {
		this.service.getLocations().then((response) => {
			this.locations = response.data.results;
		});
	}
		
		
	// Remove call (not an api call)
	removeLocation(location) {
		if (location.removeConfirmed) {
			this.service.removeRelationship(location, this.newLocations, this.locations, this.removeToLocations);
		} else {
			location.removeConfirmed = true;
		}
	}
		
		
	// UPDATE calls
	update() {
		var promises = [];
		
		promises.push(this.createLocations());
		promises.push(this.updateLocations(true));
		promises.push(this.updateLocations());
		
		this.$q.all(promises).then(() => {
			this.newLocations = [];
			this.removeToLocations = [];
			this.$scope.$emit(constants.Events.Update.Location.Done);
		}, () => {
			this.$scope.$emit(constants.Events.Update.Location.Error);
		});
	}
	
	
	updateLocations(removing) {
		if (removing) {
			return this.service.updateRelationship(this.removeToLocations, 'updateLocations', 0);
		}
		return this.service.updateRelationship(this.locations, 'updateLocations', this.newLocations.length);
	}
}