class MapController {
    constructor($rootScope, NgMap, BorderStationService) {
        'ngInject';
        this.borderStationService = BorderStationService;
        this.rootScope = $rootScope;

        this.stationInfoWindowId = 'marker-station-info-window';
        this.locationInfoWindowId = 'marker-location-info-window';

        this.borderStations = [];
        this._fusionLayerOptions = null;
        this.showAddress2Layer = true;
        this.showBorderStationLocations = true;

        this.createMapListeners();
        this.getBorderStations();

        NgMap.getMap().then((map) => { this.map = map; });

        //fix to get showInfoWindow to have the controller as this.
        //Due to using an on-click callback with ng-map. ng-click does not work.
        this.showStationInfoWindow = this.showStationInfoWindow.bind(this);
        this.showLocationInfoWindow = this.showLocationInfoWindow.bind(this);
    }

    get center() {
        return '28.394857, 84.124008';
    }

    get apiUrl() {
        return "https://maps.google.com/maps/api/js?key=AIzaSyChNFPd_bOOnk59AkeKM862OqN80Lvp56g";
    }

    get fusionLayerOptions() {
        if(!this._fusionLayerOptions) {
            this._fusionLayerOptions = {
                query: {
                    select: 'col13',
                    from: '1r-omWhMz1wzQG3-e55K7dmCetVe3fRWX4Ai4G_U1'
                },
                styles: [{
                    polygonOptions: {
                        fillOpacity: 0.2,
                        fillColor: '#FFFFFF'
                    }
                }],
                styleId: 2,
                templateId: 2
            };
        }
        return this._fusionLayerOptions;
    }

    createMapListeners() {
        this.rootScope.$on('toggleAddress2Layer', (e, showAddress2Layer) => { this.showAddress2Layer = showAddress2Layer; });
        this.rootScope.$on('toggleBorderStationLocations', (e, showBorderStationLocations) => { this.showBorderStationLocations = showBorderStationLocations; });
    }

    getBorderStations() {
        this.borderStationService.getBorderStations(true).then((response) => {
            this.borderStations = response.data.map(this.mapStationData);
            this.locations = this.mapLocationData(response.data);
        });
    }

    mapLocationData(borderStations) {
        let locations = [];
        borderStations.forEach((borderStation) => {
            borderStation.location_set.forEach((location) => {
                locations.push({
                    id: location.id,
                    name: location.name,
                    markerId: `station-${borderStation.id}-location-${location.id}`,
                    station: borderStation,
                    position: [location.latitude, location.longitude],
                    dateEstablished: borderStation.date_established,
                });
            });
        });
        return locations;
    }

    mapStationData(borderStation) {
        return {
            id: borderStation.id,
            markerId: `station-${borderStation.id}`,
            stationName: borderStation.station_name,
            stationCode: borderStation.station_code,
            position: [borderStation.latitude, borderStation.longitude],
            dateEstablished: borderStation.date_established,
            hasShelter: borderStation.has_shelter,
            interceptions: borderStation.number_of_interceptions,
            ytdInterceptions: borderStation.ytd_interceptions,
            numberOfStaff: borderStation.number_of_staff
        };
    }

    hideInfoWindows() {
        this.map.hideInfoWindow(this.locationInfoWindowId);
        this.map.hideInfoWindow(this.stationInfoWindowId);
    }

    showStationInfoWindow(e, station) {
        this.hideInfoWindows();
        this.station = station;
        this.map.showInfoWindow(this.stationInfoWindowId, station.markerId);
    }

    showLocationInfoWindow(e, location) {
        this.hideInfoWindows();
        this.location = location;
        this.map.showInfoWindow(this.locationInfoWindowId, location.markerId);
    }
}

export default MapController;
