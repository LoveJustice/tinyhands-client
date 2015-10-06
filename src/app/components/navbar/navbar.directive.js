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
	constructor (session) {
		'ngInject';
		
		this.session = session;
	}
	
	logout () {
		this.session.logout();
	}
}

export default NavbarDirective;