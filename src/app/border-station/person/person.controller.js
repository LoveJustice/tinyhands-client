import constants from './../constants.js';

export default class PersonController {
	constructor($q, $scope, BorderStationService) {
		'ngInject';
		
		this.$q = $q;
		this.$scope = $scope;
		this.service = BorderStationService;
		
		
		this.committeeMemTitle = 'Committee Members';
		this.staffTitle = 'Staff';
		this.newCommitteeMembers = [];
		this.newStaff = [];
		this.people = {
			committeeMembers: {
				data: [],
				name: this.committeeMemTitle
			},
			staff: {
				data: [],
				name: this.staffTitle
			}
		};
		this.removeToCommitteeMembers = [];
		this.removeToStaff = [];
		
		if (this.service.borderStationId) {
			this.getCommitteeMembers();
			this.getStaff();
		}
		this.createListeners();
	}
	
		
	addPerson(persons) {
		var newPerson = {
			border_station: this.service.borderStationId
		};
		if (persons.name === this.staffTitle) {
			this.newStaff.push(newPerson);
			this.people.staff.data.push(newPerson);
		} else if (persons.name === this.committeeMemTitle) {
			this.newCommitteeMembers.push(newPerson);
			this.people.committeeMembers.data.push(newPerson);
		}
	}
	
	
	// CREATE calls
	createCommitteeMembers() {
		return this.service.createRelationship(this.newCommitteeMembers, 'createCommitteeMember');
	}
	
	
	createListeners() {
		this.$scope.$on(constants.Events.Create.BorderStation.Done,() => { // POST listener
			this.service.setBorderStationIdOfData(this.newCommitteeMembers);
			this.service.setBorderStationIdOfData(this.newStaff);
			this.service.setBorderStationIdOfData(this.people.committeeMembers.data);
			this.service.setBorderStationIdOfData(this.people.staff.data);
			this.update();
		});
		this.$scope.$on(constants.Events.Get.BorderStation,() => { // GET listener
			this.getCommitteeMembers();
			this.getStaff();
		});
		this.$scope.$on(constants.Events.Update.BorderStation, () => { // PUT listener
			this.update();
		});
	}	
	
	
	createStaff() {
		return this.service.createRelationship(this.newStaff, 'createStaff');
	}
	
	
	// GET calls
	getCommitteeMembers() {
		this.service.getCommitteeMembers().then((response) => {
			this.people.committeeMembers.data = response.data.results;
		});
	}
	
	getStaff() {
		this.service.getStaff().then((response) => {
			this.people.staff.data = response.data.results;
		});
	}
		
		
	// Remove calls (not api calls)
	removeCommitteeMember(member) {
		this.service.removeRelationship(member, this.newCommitteeMembers, this.people.committeeMembers.data, this.removeToCommitteeMembers);
	}
	
	removePerson(persons, person) {
		if (person.removeConfirmed) {
			if (persons.name === this.staffTitle) {
				this.removeStaff(person);
			} else {
				this.removeCommitteeMember(person);
			}
		} else {
			person.removeConfirmed = true;
		}
	}
	
	removeStaff(staff) {
		this.service.removeRelationship(staff, this.newStaff, this.people.staff.data, this.removeToStaff);
	}
		
		
	// UPDATE calls
	update() {
		var promises = [];
		
		promises.push(this.createCommitteeMembers());
		promises.push(this.createStaff());
		promises.push(this.updateCommitteeMembers(true));
		promises.push(this.updateCommitteeMembers());
		promises.push(this.updateStaff(true));
		promises.push(this.updateStaff());
		
		this.$q.all(promises).then(() => {
			this.newCommitteeMembers = [];
			this.newStaff = [];
			this.removeToCommitteeMembers = [];
			this.removeToStaff = [];
			this.$scope.$emit(constants.Events.Update.People.Done);
		}, () => {
			this.$scope.$emit(constants.Events.Update.People.Error);
		});
	}
	
	
	updateCommitteeMembers(removing) {
		if (removing) {
			return this.service.updateRelationship(this.removeToCommitteeMembers, 'updateCommitteeMembers', 0);
		}
		return this.service.updateRelationship(this.people.committeeMembers.data, 'updateCommitteeMembers', this.newCommitteeMembers.length);
	}
	
	updateStaff(removing) {
		if (removing) {
			return this.service.updateRelationship(this.removeToStaff, 'updateStaff', 0);
		}
		return this.service.updateRelationship(this.people.staff.data, 'updateStaff', this.newStaff.length);
	}
}