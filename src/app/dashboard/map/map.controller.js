class MapController {
    constructor($rootScope, NgMap, SessionService, DashboardService) {
        'ngInject';
        this.sessionService = SessionService;
        this.dashboardService = DashboardService;
        this.rootScope = $rootScope;

        this.stationInfoWindowId = 'marker-station-info-window';
        this.locationInfoWindowId = 'marker-location-info-window';

        this.borderStations = [];
        this.inCountryStations = [];
        this.outOfCountryStations = [];
        this.inCountryLocations = [];
        this._fusionLayerOptions = null;
        this.showAddress2Layer = false;
        this.showBorderStationLocations = false;
        this.mapKey = null;

        this.createMapListeners();
        this.getBorderStations();
        this.getMapKey();

        NgMap.getMap().then((map) => { this.map = map; });

        //fix to get showInfoWindow to have the controller as this.
        //Due to using an on-click callback with ng-map. ng-click does not work.
        this.showStationInfoWindow = this.showStationInfoWindow.bind(this);
        this.showLocationInfoWindow = this.showLocationInfoWindow.bind(this);
        this.country = null;
    }

    get center() {
        let center = '0, 0';
        if (this.country !== null) {
            center = this.country.latitude + ', ' + this.country.longitude;
        }
        return center;
    }
    
    get zoom() {
        let zoom_level = 8;
        if (this.country !== null) {
            zoom_level = this.country.zoom_level;
        }
        return zoom_level;
    }
    
    getMapKey() {
        this.dashboardService.getMapKey().then((response) => { this.mapKey = response.data; });
    }

    get apiUrl() {
        let api = null
        if (this.mapKey) {
            api = "https://maps.google.com/maps/api/js?key=" + this.mapKey;
        }
        return api;
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
        this.rootScope.$on('toggleBorderStationLocations', (e, showBorderStationLocations) => { this.showBorderStationLocations = showBorderStationLocations; });
        this.rootScope.$on('toggleAddress2Layer', (e, showAddress2Layer) => { this.showAddress2Layer = showAddress2Layer; });
        this.rootScope.$on('mapLocation', (e, country) => { this.country = country; this.separateBorderStations();});
    }

    getBorderStations() {
        this.dashboardService.getUserStations(this.sessionService.user.id).then((response) => {
            this.borderStations = response.data;
            this.separateBorderStations();
        });
    }
    
    separateBorderStations() {
        this.inCountryStations = [];
        this.outOfCountryStations = [];
        this.inCountryLocations = [];
        
        this.borderStations.forEach((borderStation) => {
            if (borderStation.country_name === this.country.name) {
                this.inCountryStations.push(this.mapStationData(borderStation));
                borderStation.location_set.forEach((location) => {
                    this.inCountryLocations.push({
                        id: location.id,
                        name: location.name,
                        markerId: `station-${borderStation.id}-location-${location.id}`,
                        station: borderStation,
                        position: [location.latitude, location.longitude],
                        dateEstablished: borderStation.date_established,
                    });
                });
            } else {
                this.outOfCountryStations.push(this.mapStationData(borderStation));
            }
        });
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
