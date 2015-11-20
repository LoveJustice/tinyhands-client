import DetailController from './detail.controller';

class DetailDirective {
	constructor () {
		'ngInject';
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/border-station/detail/detail.html',
			controller: DetailController,
			controllerAs: 'detailCtrl'
		};
		
		return directive;
	}
}

export default DetailDirective;