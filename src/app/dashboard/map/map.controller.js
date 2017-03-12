class MapController {
    constructor($rootScope, NgMap, BorderStationService) {
        'ngInject';

        this.borderStationService = BorderStationService;
        this.rootScope = $rootScope;

        this.infoWindowId = 'marker-info-window';
        this.borderStations = [];
        this._fusionLayerOptions = null;
        this.showAddress2Layer = true;

        this.createMapListeners();
        this.getBorderStations();

        NgMap.getMap().then((map) => { this.map = map; });

        //fix to get showInfoWindow to have the controller as this.
        //Due to using an on-click callback with ng-map. ng-click does not work.
        this.showInfoWindow = this.showInfoWindow.bind(this);
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
        this.rootScope.$on('toggleAddress2Layer', (e, s) => { this.toggleAddress2Layer(e, s); });
    }

    getBorderStations() {
        this.borderStationService.getBorderStations(true).then((response) => {
            this.borderStations = response.data.map(this.mapStationData);
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

    showInfoWindow(e, station) {
        this.map.hideInfoWindow(this.infoWindowId);       
        this.station = station;
        this.map.showInfoWindow(this.infoWindowId, station.markerId);
    }

    toggleAddress2Layer(event, showAddress2Layer) {
        if (showAddress2Layer) {
            this.showAddress2Layer = true;
        } else {
            this.showAddress2Layer = false;
        }
    }
}

export default MapController;
