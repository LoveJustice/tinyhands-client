export default class BorderStationService {
	constructor(BaseService, $q) {
		'ngInject';
		this.service = BaseService;
		this.$q = $q;
		
		this.borderStationId = 0;
	}

	// POSTs
	createBorderStation(data) {
		return this.service.post('api/border-station/', data);
	}
	
	createCommitteeMember(data) {
		return this.service.post('api/committee-member/', data);
	}

	createLocation(data) {
		return this.service.post('api/location/', data);
	}

	createStaff(data) {
		return this.service.post('api/staff/', data);
	}
	
	createRelationship(createArray, createApiFunction) {
		var expectedNumCalls = createArray.length;
		var numCalls = 0;
		var deferred = this.$q.defer();
		angular.forEach(createArray, (anObject) => {
			this[createApiFunction](anObject).then((response) => {
				numCalls++;
				anObject = response.data;
				if (numCalls >= expectedNumCalls) {
					deferred.resolve('Finished sending create calls');
				}
			}, (error) => {
				deferred.reject(error);
				this.handleErrors(error);
			});
		});
		
		if (expectedNumCalls === 0) {
			deferred.resolve('No create calls needed');
		}
		
		return deferred.promise;
	}

	
	// GETs
	getBorderStations() {
		return this.service.get('api/border-station/');
	}
	
	getCommitteeMembers(bsId=this.borderStationId) {
		return this.service.get('api/committee-member/?border_station=' + bsId);
	}

	getDetails() {
		return this.service.get('api/border-station/' + this.borderStationId + '/');
	}

	getLocations() {
		return this.service.get('api/location/?border_station=' + this.borderStationId);
	}

	getStaff(bsId=this.borderStationId) {
		return this.service.get('api/staff/?border_station=' + bsId);
	}
	
	
	// REMOVE
	removeRelationship(value, newArray, currentArray, removeArray) {
		var idx = newArray.indexOf(value);
		if (idx >= 0) { // If relation was just created and isnt (shouldnt be) in the db
			newArray.splice(idx, 1);
		} else { // If exists in db
			value.border_station = null;
			removeArray.push(value); // Add item to remove array to finalize removal upon updating
		}
		
		if (currentArray.length > 0) {
			// Remove item from list
			idx = currentArray.indexOf(value);
			currentArray.splice(idx, 1);
		}
	}
	
	
	setBorderStationIdOfData(data) {
		data.map(el => el.border_station = this.borderStationId);
	}


	// PUTs
	updateCommitteeMembers(memberId, data) {
		return this.service.put('api/committee-member/' + memberId + '/', data);
	}

	updateDetails(borderStationId, data) {
		return this.service.put('api/border-station/' + borderStationId + '/', data);
	}

	updateLocations(locationId, data) {
		return this.service.put('api/location/' + locationId + '/', data);
	}
	
	updateRelationship(updateArray, updateApiFunction, numNew=0) {
		var expectedNumCalls = updateArray.length - numNew;
		var numCalls = 0;
		var deferred = this.$q.defer();
		angular.forEach(updateArray, (anObject) => {
			if (anObject.id !== undefined) {
				this[updateApiFunction](anObject.id, anObject).then(() => {
					numCalls++;
					if (numCalls >= expectedNumCalls) {
						deferred.resolve('Finished sending update calls');
					}
				}, (error) => {
					deferred.reject(error);
					this.handleErrors(error);
				});
			}
		});
		
		if (expectedNumCalls === 0) {
			deferred.resolve('No update calls needed');
		}
		
		return deferred.promise;
	}

	updateStaff(staffId, data) {
		return this.service.put('api/staff/' + staffId + '/', data);
	}
}
