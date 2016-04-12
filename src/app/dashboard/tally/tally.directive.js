import TallyController from './tally.controller.js';

class TallyDirective {
	constructor () {
		'ngInject';
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/dashboard/tally/tally.html',
			controller: TallyController,
			controllerAs: 'tally'
		};
		
		return directive;
	}
}


export default TallyDirective;