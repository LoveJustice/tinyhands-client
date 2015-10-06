class MapDirective {
	constructor () {
		'ngInject';
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/components/map/map.html',
			controller: MapController,
			controllerAs: 'map'
		};
		
		return directive;
	}
}

class MapController {
	constructor (uiGmapGoogleMapApi) {
		'ngInject';
		
		this.activate(uiGmapGoogleMapApi);
		
		this.maps = null;
	}
	
	activate (gMapsApi) {
		var self = this;
		gMapsApi.then((maps) => {
			self.maps = maps;
			self.setMapData();
			self.createAddress2Layer();
		});
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
	
	createAddress2Layer () {
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
}


export default MapDirective;