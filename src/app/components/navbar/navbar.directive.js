class NavbarDirective {
	constructor () {
		'ngInject';
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/components/navbar/navbar.html',
			controller: NavbarController,
			controllerAs: 'navbar'
		};
		
		return directive;
	}
}

class NavbarController {
	constructor (session, $interval) {
		'ngInject';
		
		this.session = session;
		this.interval = $interval;
		this.user = {};
		this.getUser();
		this.nepalTime = window.moment.tz("Asia/Kathmandu").format("MMMM Do YYYY, h:mm:ssA");
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

export default NavbarDirective;