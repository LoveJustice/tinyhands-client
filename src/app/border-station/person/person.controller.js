export default class PersonController {
	constructor($scope, BorderStationService) {
		'ngInject';
		
		this.$scope = $scope;
		this.service = BorderStationService;
		
		
		this.committeeMemTitle = 'Committee Members';
		this.staffTitle = 'Staff';
		this.newCommitteeMembers = [];
		this.newStaff = [];
		this.people = {
			staff: {
				data: [],
				name: this.staffTitle
			},
			committeeMembers: {
				data: [],
				name: this.committeeMemTitle
			}
		};
		this.removeToStaff = [];
		this.removeToCommitteeMembers = [];
		
		
		this.activate();
	}
	
	activate() {
		this.$scope.$on('GetBorderStationData',() => { // Create listener
			this.getCommitteeMembers();
			this.getStaff();
		});
		this.getCommitteeMembers();
		this.getStaff();
	}
		
	addPerson(persons) {
		var newPerson = {
			border_station: this.borderStationId
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
	createCommitteeMembers(members) {
		return this.service.createRelationship(members, this.service.createCommitteeMember);
	}
	
	createStaff(staff) {
		return this.service.createRelationship(staff, this.service.createStaff);
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
		
		
	// REMOVE calls
	removeCommitteeMember(member) {
		this.service.removeRelationship(member, this.newCommitteeMembers, this.people.committeeMembers.data, this.removeToCommitteeMembers);
	}
	
	removePerson(persons, person) {
		if (person.removeConfirmed) {
			persons.name = this.staffTitle ? this.removeStaff(person) : this.removeCommitteeMember(person);
		} else {
			person.removeConfirmed = true;
		}
	}
	
	removeStaff(staff) {
		this.service.removeRelationship(staff, this.newStaff, this.people.staff.data, this.removeToStaff);
	}
		
		
	// UPDATE calls
	updateCommitteeMembers(committeeMembers, removing) {
		if (removing) {
			return this.service.updateRelationship(committeeMembers, this.service.updateCommitteeMembers, 0);
		}
		return this.service.updateRelationship(committeeMembers, this.service.updateCommitteeMembers, this.newCommitteeMembers.length);
	}
	
	updateStaff(staff, removing) {
		if (removing) {
			return this.service.updateRelationship(staff, this.service.updateStaff, 0);
		}
		return this.service.updateRelationship(staff, this.service.updateStaff, this.newStaff.length);
	}
}