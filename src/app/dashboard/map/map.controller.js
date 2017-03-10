import infoWindowTemplate from './infoWindow.html'

class MapController {
    constructor($rootScope, BorderStationService, uiGmapGoogleMapApi) {
        'ngInject';

        this.borderStationService = BorderStationService;
        this.maps = null;
        this.rootScope = $rootScope;

        this.nepal = {
            lat: 28.394857,
            lon: 84.124008
        };

        this.borderStations = [];
        this.showAddress2Layer = true;
        this.templateUrl = infoWindowTemplate;

        this.createMapListeners();
        this.initializeGoogleMaps(uiGmapGoogleMapApi);
    }

    createMapListeners() {
        this.rootScope.$on('toggleAddress2Layer', (e, s) => { this.toggleAddress2Layer(e, s); });
    }

    getBorderStations() {
        this.borderStationService.getBorderStations(true).then((response) => {
            this.borderStations = response.data;
            this.borderStations.forEach((borderStation) => {
                this.setInfoWindowParams(borderStation);
            });
        });
    }

    getBorderStationStaff(borderStation) {
        borderStation.numberOfStaff = 0;
        return this.borderStationService.getStaff(borderStation.id).then((response) => {
            borderStation.numberOfStaff += response.data.count;
        });
    }

    initializeGoogleMaps(gMapsApi) {
        gMapsApi.then((maps) => {
            this.maps = maps;
            this.setAddress2Layer();
            this.setMapData();

            this.getBorderStations();
        });
    }

    setAddress2Layer() {
        this.layerOptions = {
            query: {
                select: 'col13',
                from: '1r-omWhMz1wzQG3-e55K7dmCetVe3fRWX4Ai4G_U1'
            },
            styles: [{
                polygonOptions: {
                    fillOpacity: 0.2
                }
            }],
            options: {
                styleId: 2,
                templateId: 2
            }
        };
    }

    setInfoWindowParams(borderStation) {
        borderStation.templateUrl = this.templateUrl;
        borderStation.templateParameter = {
            date_established: borderStation.date_established,
            has_shelter: borderStation.has_shelter,
            id: borderStation.id,
            number_of_staff: borderStation.number_of_staff,
            number_of_interceptions: borderStation.number_of_interceptions,
            ytd_interceptions: borderStation.ytd_interceptions,
            station_code: borderStation.station_code,
            station_name: borderStation.station_name
        };
    }

    setMapData() {
        this.data = {
            control: {},
            options: {
                mapTypeControlOptions: {
                    position: this.maps.ControlPosition.TOP_LEFT,
                    style: this.maps.MapTypeControlStyle.HORIZONTAL_BAR
                },
                panControl: false,
                streetViewControl: false,
                zoomControlOptions: {
                    position: this.maps.ControlPosition.RIGHT_BOTTOM,
                    style: this.maps.ZoomControlStyle.SMALL
                }
            },
        };
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
