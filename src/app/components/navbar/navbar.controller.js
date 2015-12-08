export default class NavbarController {
	constructor ($interval, $timeout, BorderStationService, session) {
		'ngInject';
		
		this.$interval = $interval;
		this.$timeout = $timeout;
		this.borderStationService = BorderStationService;
		this.session = session;
		
		
		this.borderStations = [];
		this.nepalTime = window.moment.tz("Asia/Kathmandu").format("MMMM Do YYYY, h:mm:ssA");
		this.user = {};
		
		
		this.activate();
	}
	
	activate() {
		this.getUser();
		this.getBorderStations();
	}
	
	getBorderStations() {
		this.borderStationService.getBorderStations().then((response) => {
			this.borderStations = response.data;
		});
	}

	getUser () {
		if (sessionStorage.token){
			this.session.me().then(
				(promise) => {
					this.user = promise.data;
				});
		}
	}
	
	logout () {
		this.session.logout();
	}
}