import LocationSelectTemplateUrl from './location-select.html';

export class LocationSelectController {
    constructor(LocationService) {
        'ngInject';
        this.LocationService = LocationService;
        this.getLocation();
        this.searchLocation = '';
        this._selectedLocationList = [];
    }

    get selectedLocationList() {
        return this._selectedLocationList;
    }

    set selectedLocationList(value) {
        this._selectedLocationList = value;
        this.selectedLocation = this._selectedLocationList.join(';');
    }

    $onInit() {
        if (this.selectedLocation === undefined) {
                this.selectedLocation = '';
        }
        this.priorSelectedLocation = this.selectedLocation;
        this.selectedLocationList = this.selectedLocation.split(';').filter((x) => x.length > 0).map((x) => x.trim());
        this.priorStationId = '';
    }
    
    $doCheck() {
        if (this.selectedLocation !== this.priorSelectedLocation) {
                this.priorSelectedLocation = this.selectedLocation;
                if (this.selectedLocation === null) {
                	this.selectedLocation = '';
                }
                this.selectedLocationList = this.selectedLocation.split(';').filter(x => x.length > 0).map(x => x.trim());
        }
        if (this.priorStationId !== this.stationId) {
                this.priorStationId = this.stationId;
                this.getLocation();
        }
    }

    filterLocationByName(locationName, value) {
        if (locationName && value) {
            let searchValue = value.toLowerCase();
            return _.includes(locationName.toLowerCase(), searchValue);
        }
        return false;
    }

    getLocation() {
        if (typeof this.stationId !== 'undefined') {
                this.LocationService.getLocation(this.stationId).then((response) => {
                    this.location = response.data.map((x) => x.name);
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