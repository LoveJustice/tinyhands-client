class MapController {
	constructor ($rootScope, BorderStationService, uiGmapGoogleMapApi) {
		'ngInject';

		this.borderStationService = BorderStationService;
		this.maps = null;
		this.rootScope = $rootScope;
		
		this.nepal = {
			lat: 28.394857,
			lon: 84.124008
		}
		
		this.borderStations = [];
		this.showAddress2Layer = true;
		
		this.activate(uiGmapGoogleMapApi);
	}

	activate(gMapsApi) {
		gMapsApi.then((maps) => {
			this.maps = maps;
			this.setMapData();
			this.setAddress2Layer();
		});

		this.rootScope.$on('toggleAddress2Layer',(e,s) => {this.toggleAddress2Layer(e,s);});
		
		this.getBorderStations();
	}
	
	getBorderStations() {
		this.borderStationService.getBorderStations().then((response) => {
			this.borderStations = response.data.results;
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
				}}],
			options: {
				styleId: 2,
				templateId: 2
			}
		};
	}

	setMapData() {
		this.data = {
			center: {latitude: this.nepal.lat, longitude: this.nepal.lon},
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
			zoom: 8
		};
	}

	toggleAddress2Layer(event, showAddress2Layer) {
		if(showAddress2Layer) {
			this.showAddress2Layer = true;
		} else {
			this.showAddress2Layer = false;
		}
	}
}

export default MapController;