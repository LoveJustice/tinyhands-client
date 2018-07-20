import LocationSelectTemplateUrl from './location-select.html';

export class LocationSelectController {
    constructor(LocationService) {
        'ngInject';
        this.LocationService = LocationService;

        this.getLocations();
    }

    getLocations() {
        this.LocationService.getLocation().then(response => {
            this.locations = response.data.results.map(x => x.name);
        });
    }
}

export default {
    bindings: {
        selectedLocation: '='
    },
    controller: LocationSelectController,
    templateUrl: LocationSelectTemplateUrl,
    transclude: true
};