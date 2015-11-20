export default class BorderStationController {
	constructor($scope, $stateParams, $timeout, BorderStationService) {
		'ngInject';
		
		this.$scope = $scope;
		this.$timeout = $timeout;
		
		BorderStationService.borderStationId = $stateParams.id;
		
		
		this.loading = false;
		this.updateButtonText = 'Update Station';
		this.updateStatusText = this.updateButtonText;
		
		
	}
		
		
	// GET calls
	getBorderStationData() {
		this.loading = true;
		
		this.$scope.$broadcast('GetBorderStationData');
	}
	
	updateStation() {
		this.updateStatusText = 'Saving...';
		
		var promises = [];
		
		// Create Calls
		promises.push(vm.createCommitteeMembers(vm.newCommitteeMembers));
		promises.push(vm.createLocations(vm.newLocations));
		promises.push(vm.createStaff(vm.newStaff));
		
		// Update Calls
		promises.push(vm.updateCommitteeMembers(vm.people.committeeMembers.data));
		promises.push(vm.updateDetails(vm.details));
		promises.push(vm.updateLocations(vm.locations));
		promises.push(vm.updateStaff(vm.people.staff.data));
		
		// Remove Calls
		promises.push(vm.updateCommitteeMembers(vm.removeToCommitteeMembers, true));
		promises.push(vm.updateLocations(vm.removeToLocations, true));
		promises.push(vm.updateStaff(vm.removeToStaff, true));
		
		$q.all(promises).then(function() {
			vm.newCommitteeMembers = [];
			vm.newLocations = [];
			vm.newStaff = [];
			getBorderStationData();
			vm.updateStatusText = 'Saved';
			$timeout(function() {
				vm.updateStatusText = updateButtonText;
			}, 2000);
		}, function(error) {
			console.log(error);
			vm.updateStatusText = 'Error';
			$timeout(function() {
				vm.updateStatusText = updateButtonText;
			}, 4000);
		});
	}
}