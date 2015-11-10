import BaseService from '../../base.service';

class TallyService extends BaseService {
	constructor($http) {
		'ngInject';
		
		super();
		
		this.$http = $http;
	}
	
	getTallyDays() {
		return this.$http.get('http://localhost:8000/portal/tally/days/').then((data) => {
			// Data should be:
			// {0:{dayOfWeek:'Monday',
			//     interceptions: {<String of StationCode>:<Num of Interceptions>}},
			//  1:{dayOfWeek:'Sunday',
			//     interceptions: {...}},
			// }
			return data;
		}, (error) => {
			window.console.log(error);
		});
	}
}

export default TallyService;