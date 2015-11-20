import PersonController from './person.controller';

class PersonDirective {
	constructor () {
		'ngInject';
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/border-station/person/person.html',
			controller: PersonController,
			controllerAs: 'personCtrl'
		};
		
		return directive;
	}
}

export default PersonDirective;