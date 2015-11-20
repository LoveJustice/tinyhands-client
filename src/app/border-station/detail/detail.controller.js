export default class DetailController {
	constructor($scope, BorderStationService) {
		'ngInject';
		
		this.$scope = $scope;
		this.service = BorderStationService;
		
		this.details = {};
		
		this.activate();
	}
	
	activate() {
		this.$scope.$on('GetBorderStationData',() => { // Create listener
			this.getDetails();
		});
		this.getDetails();
	}
		
	changeStationStatus() {
		this.details.open = !this.details.open;
	}
		
		
	// Date Formatting
	formatDate (dateToFormat) { // Formats date string to YYYY[-MM[-DD]]
		return window.moment(dateToFormat).format('YYYY-MM-DD');
	}
	
	
	// GET Calls	
	getDetails() {
		this.service.getDetails().then((response) => {
			console.log(response);
		});
	}
		
		
	// UPDATE calls
	updateDetails(details) {
		details.date_established = this.formatDate(details.date_established);
		
		return this.service.updateRelationship([details], this.service.updateDetails, 0);
	}
}