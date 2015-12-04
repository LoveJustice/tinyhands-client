import BaseService from '../base.service';

export default class BorderStationService extends BaseService {
	constructor($http, $q) {
		'ngInject';
		super();
		
		
		this.$http = $http;
		this.$q = $q;
		
		this.borderStationId = 0;
	}

	// POSTs
	createBorderStation(data) {
		return this.post('api/border-station/', data);
	}
	
	createCommitteeMember(data) {
		return this.post('api/committee-member/', data);
	}

	createLocation(data) {
		return this.post('api/location/', data);
	}

	createStaff(data) {
		return this.post('api/staff/', data);
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
		return this.get('api/border-station/');
	}
	
	getCommitteeMembers() {
		return this.get('api/committee-member/?border_station=' + this.borderStationId);
	}

	getDetails() {
		return this.get('api/border-station/' + this.borderStationId + '/');
	}

	getLocations() {
		return this.get('api/location/?border_station=' + this.borderStationId);
	}

	getStaff() {
		return this.get('api/staff/?border_station=' + this.borderStationId);
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
		return this.put('api/committee-member/' + memberId + '/', data);
	}

	updateDetails(borderStationId, data) {
		return this.put('api/border-station/' + borderStationId + '/', data);
	}

	updateLocations(locationId, data) {
		return this.put('api/location/' + locationId + '/', data);
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
		return this.put('api/staff/' + staffId + '/', data);
	}
}