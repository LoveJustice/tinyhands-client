export default class DetailController {
	constructor($scope, BorderStationService) {
		'ngInject';
		
		this.$scope = $scope;
		this.service = BorderStationService;
		
		this.details = {};
		
		this.activate();
	}
	
	activate() {
		this.getDetails();
	}
		
	changeStationStatus() {
		this.details.open = !this.details.open;
	}
	
	
	createListeners() {
		this.$scope.$on('GetBorderStationData',() => { // Create listener
			this.getDetails();
		});
		this.$scope.$on('UpdateBorderStationData',() => {
			this.updateDetails();
		});
	}
		
		
	// Date Formatting
	formatDate (dateToFormat) { // Formats date string to YYYY[-MM[-DD]]
		return window.moment(dateToFormat).format('YYYY-MM-DD');
	}
	
	
	// GET Calls	
	getDetails() {
		this.service.getDetails().then((response) => {
			this.details = response.data;
		});
	}
		
		
	// UPDATE calls
	updateDetails() {
		this.details.date_established = this.formatDate(this.details.date_established);
		
		return this.service.updateRelationship([this.details], this.service.updateDetails);
	}
}