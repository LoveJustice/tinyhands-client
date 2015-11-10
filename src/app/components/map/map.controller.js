class MapController {
	constructor ($rootScope, uiGmapGoogleMapApi) {
		'ngInject';
		
		this.maps = null;
		this.rootScope = $rootScope;
		this.showAddress2Layer = true;
		
		this.activate(uiGmapGoogleMapApi);
	}
	
	activate (gMapsApi) {
		var self = this;
		gMapsApi.then((maps) => {
			self.maps = maps;
			self.setMapData();
			self.setAddress2Layer();
		});
		
		this.rootScope.$on('toggleAddress2Layer', this.toggleAddress2Layer);
	}
	
	setAddress2Layer () {
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
	
	setMapData () {
		this.mapData = {
			center: {latitude: 28.394857, longitude: 84.124008},
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
	
	toggleAddress2Layer (event, showAddress2Layer) {
		if (showAddress2Layer) {
			this.setAddress2Layer();
		} else {
			this.layerOptions = {};
		}
	}
}

export default MapController;