export default class NavbarController {
	constructor ($interval, session) {
		'ngInject';
		
		this.interval = $interval;
		this.session = session;
		
		
		this.nepalTime = window.moment.tz("Asia/Kathmandu").format("MMMM Do YYYY, h:mm:ssA");
		this.user = {};
		
		
		this.activate();
	}
	
	activate() {
		this.getUser();
	}

	getUser () {
		if (sessionStorage.token){
			this.session.me().then(
					(promise) => {
						this.user = promise.data;
					}
			);
		}
	}
	
	logout () {
		this.session.logout();
	}
}