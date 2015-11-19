import NavbarController from './navbar.controller';

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


export default NavbarDirective;