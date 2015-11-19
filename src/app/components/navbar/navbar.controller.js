export default class NavbarController {
	constructor ($interval, $timeout, session) {
		'ngInject';
		
		this.$interval = $interval;
		this.session = session;
		this.$timeout = $timeout;
		
		
		this.nepalTime = window.moment.tz("Asia/Kathmandu").format("MMMM Do YYYY, h:mm:ssA");
		this.user = {};
		
		
		this.activate();
	}
	
	activate() {
		this.getUser();
	}

	getUser () {
		if (sessionStorage.token){
			this.$timeout( () => {
				this.session.me().then(
					(promise) => {
						this.user = promise.data;
					});
			});
		}
	}
	
	logout () {
		this.session.logout();
	}
}