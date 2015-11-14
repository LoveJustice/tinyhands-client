class TallyController {
	constructor ($rootScope, tallyService) {
		'ngInject';

		this.rootScope = $rootScope;
		this.service = tallyService;

		this.days = [];
		this.userId = null;

		this.activate();
	}

	activate() {
		this.getTallyData(true);
	}

	changeColor(day) {
		if (day.change && !day.seen) {
			return {'background-color': 'rgba(255,0,0,0.5)',
							'color': 'white'};
		}
	}

	checkDifferences(data){
		if (this.days.length > 0) {
			for(var i in data.reverse()){
				var interceptions = data[i].interceptions;
				data[i].change = false;
				data[i].seen = false;
				for(var key in interceptions){
					if(interceptions.hasOwnProperty(key)){
						if(this.days[i].interceptions[key] !== interceptions[key]){
							//data has changed
							data[i].change = true;
						}else if(this.days[i].change && !this.days[i].seen){
							//data was previously changed but has not been seen
							data[i].change = true;
						}
					}
				}
			}
		}else{ //localStorage days is null
			for(var x in data){
				if(!this.isEmptyObject(data[x].interceptions)){
					data[x].change = true;
					data[x].seen = false;
				}
			}
		}
		this.days = data;
	}

	getDayOfWeek(date) {
		var newDate = window.moment(date);
		var today = window.moment().tz("Asia/Kathmandu");
		if (today.date() === newDate.date()) {
			return 'Today';
		}
		var nameOfDay = newDate.format('dddd');
		return nameOfDay;
	}

	getTallyData(firstCall) {
		return this.service.getTallyDays().then((promise) => {
			var data = promise.data;
			if(firstCall){
				this.userId = data.id;
				this.getTallyLocalStorage();
				this.checkDifferences(data.days);
				window.setInterval(() => {this.getTallyData();}, 60000);
			}else{ //updates
				this.checkDifferences(data.days);
			}
			this.saveTallyLocalStorage();
		});
	}

	getTallyLocalStorage() {
		var oldTally = window.localStorage.getItem('tally-'+this.userId);
		if(oldTally){
			this.days = JSON.parse(oldTally);
		}
	}

	isEmptyObject(obj) {
		return $.isEmptyObject(obj);
	}

	onMouseLeave(day){
		day.seen = true;
		this.saveTallyLocalStorage();
	}

	saveTallyLocalStorage() {
		window.localStorage.setItem('tally-'+this.userId, JSON.stringify(this.days));
	}

	sumNumIntercepts(day) {
		var sumInt = 0;
		for (var key in day.interceptions) {
			sumInt += day.interceptions[key];
		}
		return sumInt;
	}
}

export default TallyController;