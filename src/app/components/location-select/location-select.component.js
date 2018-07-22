import LocationSelectTemplateUrl from './location-select.html';

export class LocationSelectController {
    constructor(LocationService) {
        'ngInject';
        this.LocationService = LocationService;
        this.priorStationId = this.stationId;
        this.getLocations();
    }
    
    $doCheck() {
    	if (this.priorStationId !== this.stationId) {
    		this.priorStationId = this.stationId;
    		this.getLocations();
    	}
    }

    getLocations() {
    	if (typeof this.stationId !== 'undefined') {
	        this.LocationService.getLocation(this.stationId).then(response => {
	            this.locations = response.data.results.map(x => x.name);
	        });
    	}
    }
}

export default {
    bindings: {
        selectedLocation: '=',
        stationId: '='
    },
    controller: LocationSelectController,
    templateUrl: LocationSelectTemplateUrl,
    transclude: true
};