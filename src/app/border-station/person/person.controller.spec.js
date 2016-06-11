import PersonController from './person.controller';
import BorderStationService from '../borderStation.service';
import constants from './../constants.js';

describe('PersonController', () => {
    let vm, q, scope, bss;

    beforeEach(inject(($q, $rootScope, $http) => {
        q = $q;
        scope = $rootScope;
        let fakeUtilService = {};
        bss = new BorderStationService($http, fakeUtilService, q);
        vm = new PersonController(q, scope, bss);
    }));

    describe('function constructor', () => {

        it("should set committeeMemTitle to 'Committee Members'", () => {
            expect(vm.committeeMemTitle).toEqual('Committee Members');
        });

        it("should set staffTitle to 'Staff'", () => {
            expect(vm.staffTitle).toEqual('Staff');
        });

        it('should set newCommitteeMembers to []', () => {
            expect(vm.newCommitteeMembers).toEqual([]);
        });

        it('should set newStaff to []', () => {
            expect(vm.newStaff).toEqual([]);
        });

        it('should set people to object', () => {
            let people = {
                committeeMembers: {
                    data: [],
                    name: vm.committeeMemTitle
                },
                staff: {
                    data: [],
                    name: vm.staffTitle
                }
            };
            expect(vm.people).toEqual(people);
        });

        it('should set removeToCommitteeMembers to []', () => {
            expect(vm.removeToCommitteeMembers).toEqual([]);
        });

        it('should set removeToStaff to []', () => {
            expect(vm.removeToStaff).toEqual([]);
        });

        it('should call getCommitteeMembers if service.borderStationId', () => {
            spyOn(vm, 'getCommitteeMembers');
            vm.service.borderStationId = 1;
            vm.constructor(q, scope, bss);
            expect(vm.getCommitteeMembers).toHaveBeenCalled();
        });

        it('should call getStaff if service.borderStationId', () => {
            spyOn(vm, 'getStaff');
            vm.service.borderStationId = 1;
            vm.constructor(q, scope, bss);
            expect(vm.getStaff).toHaveBeenCalled();
        });

        it('should call createListeners', () => {
            spyOn(vm, 'createListeners');
            vm.constructor(q, scope, bss);
            expect(vm.createListeners).toHaveBeenCalled();
        });

    });

    describe('function addPerson', () => {

        let newPerson = { border_station: 123 };
        let persons = { name: 'foo' };

        beforeEach(() => {
            vm.service.borderStationId = newPerson.border_station;
        });

        it('should call newStaff.push if persons.name is staffTitle', () => {
            vm.staffTitle = 'foo';
            spyOn(vm.newStaff, 'push');
            vm.addPerson(persons);
            expect(vm.newStaff.push).toHaveBeenCalledWith(newPerson);
        });

        it('should call people.staff.data.push if persons.name is staffTitle', () => {
            vm.staffTitle = 'foo';
            spyOn(vm.people.staff.data, 'push');
            vm.addPerson(persons);
            expect(vm.people.staff.data.push).toHaveBeenCalledWith(newPerson);
        });

        it('should call newCommitteeMembers.push if persons.name is committeeMemTitle', () => {
            vm.committeeMemTitle = 'foo';
            spyOn(vm.newCommitteeMembers, 'push');
            vm.addPerson(persons);
            expect(vm.newCommitteeMembers.push).toHaveBeenCalledWith(newPerson);
        });

        it('should call people.committeeMembers.data.push if persons.name is committeeMemTitle', () => {
            vm.committeeMemTitle = 'foo';
            spyOn(vm.people.committeeMembers.data, 'push');
            vm.addPerson(persons);
            expect(vm.people.committeeMembers.data.push).toHaveBeenCalledWith(newPerson);
        });

    });

    describe('function createCommitteeMembers', () => {
        it('should call service.createRelationship with newCommitteeMembers and "createCommitteeMember"', () => {
            spyOn(vm.service, 'createRelationship');
            vm.createCommitteeMembers();
            expect(vm.service.createRelationship).toHaveBeenCalledWith(vm.newCommitteeMembers, 'createCommitteeMember');
        });
    });

    describe('function createListeners', () => {

        let firstArgs;
        beforeEach(() => {
            firstArgs = [];
            vm.$scope.$on = (a, f) => {
                firstArgs.push(a);
                f();
            };
        });

        it('should call $scope.$on with first arg constants.Events.Create.BorderStation.Done', () => {
            vm.createListeners();
            expect(firstArgs).toContain(constants.Events.Create.BorderStation.Done);
        });

        it('should call $scope.$on with first arg constants.Events.Get.BorderStation', () => {
            vm.createListeners();
            expect(firstArgs).toContain(constants.Events.Get.BorderStation);
        });

        it('should call $scope.$on with first arg constants.Events.Update.BorderStation', () => {
            vm.createListeners();
            expect(firstArgs).toContain(constants.Events.Update.BorderStation);
        });

        it('should call service.setBorderStationIdOfData with newCommitteeMembers', () => {
            spyOn(vm.service, 'setBorderStationIdOfData');
            vm.createListeners();
            expect(vm.service.setBorderStationIdOfData).toHaveBeenCalledWith(vm.newCommitteeMembers);
        });

        it('should call service.setBorderStationIdOfData with newStaff', () => {
            spyOn(vm.service, 'setBorderStationIdOfData');
            vm.createListeners();
            expect(vm.service.setBorderStationIdOfData).toHaveBeenCalledWith(vm.newStaff);
        });

        it('should call service.setBorderStationIdOfData with people.committeeMembers.data', () => {
            spyOn(vm.service, 'setBorderStationIdOfData');
            vm.createListeners();
            expect(vm.service.setBorderStationIdOfData).toHaveBeenCalledWith(vm.people.committeeMembers.data);
        });

        it('should call service.setBorderStationIdOfData with people.staff.data', () => {
            spyOn(vm.service, 'setBorderStationIdOfData');
            vm.createListeners();
            expect(vm.service.setBorderStationIdOfData).toHaveBeenCalledWith(vm.people.staff.data);
        });

        it('should call getCommitteeMembers', () => {
            spyOn(vm, 'getCommitteeMembers');
            vm.createListeners();
            expect(vm.getCommitteeMembers).toHaveBeenCalled();
        });

        it('should call getStaff', () => {
            spyOn(vm, 'getStaff');
            vm.createListeners();
            expect(vm.getStaff).toHaveBeenCalled();
        });

        it('should call update 2 times', () => {
            spyOn(vm, 'update');
            vm.createListeners();
            expect(vm.update).toHaveBeenCalledTimes(2);
        });

    });

    describe('function createStaff', () => {
        it('should call service.createRelationship with newStaff and "createStaff"', () => {
            spyOn(vm.service, 'createRelationship');
            vm.createStaff();
            expect(vm.service.createRelationship).toHaveBeenCalledWith(vm.newStaff, 'createStaff');
        });
    });

    describe('function getCommitteeMembers', () => {

        it('should call service.getCommitteeMembers', () => {
            spyOn(vm.service, 'getCommitteeMembers').and.callThrough();
            vm.getCommitteeMembers();
            expect(vm.service.getCommitteeMembers).toHaveBeenCalled();
        });

        it('should set people.committeeMembers.data to "foo"', () => {
            let response = { data: { results: 'foo' } };
            vm.service.getCommitteeMembers = () => { return { then: (f) => f(response) } };
            vm.people.committeeMembers.data = null;
            vm.getCommitteeMembers();
            expect(vm.people.committeeMembers.data).toEqual('foo');
        });

    });

    describe('function getStaff', () => {

        it('should call service.getStaff', () => {
            spyOn(vm.service, 'getStaff').and.callThrough();
            vm.getStaff();
            expect(vm.service.getStaff).toHaveBeenCalled();
        });

        it('should set people.staff.data to "foo"', () => {
            let response = { data: { results: 'foo' } };
            vm.service.getStaff = () => { return { then: (f) => f(response) } };
            vm.people.staff.data = null;
            vm.getStaff();
            expect(vm.people.staff.data).toEqual('foo');
        });

    });

    describe('function removeCommitteeMember', () => {
        it('should call service.removeRelationship', () => {
            spyOn(vm.service, 'removeRelationship');
            let member = 'blah';
            vm.removeCommitteeMember(member);
            expect(vm.service.removeRelationship).toHaveBeenCalledWith(
                member,
                vm.newCommitteeMembers,
                vm.people.committeeMembers.data,
                vm.removeToCommitteeMembers
            );
        });
    });

    describe('function removePerson', () => {

        it('should call removeStaff with person if person.removeConfirmed and persons.name is staffTitle', () => {
            let person = { removeConfirmed: true };
            let persons = { name: 'foo' };
            vm.staffTitle = 'foo';
            spyOn(vm, 'removeStaff');
            vm.removePerson(persons, person);
            expect(vm.removeStaff).toHaveBeenCalledWith(person);
        });

        it('should call removeStaff with person if person.removeConfirmed and persons.name is not staffTitle', () => {
            let person = { removeConfirmed: true };
            let persons = { name: 'foo' };
            vm.staffTitle = 'bar';
            spyOn(vm, 'removeCommitteeMember');
            vm.removePerson(persons, person);
            expect(vm.removeCommitteeMember).toHaveBeenCalledWith(person);
        });

        it('should call removeStaff with person if not person.removeConfirmed', () => {
            let person = { removeConfirmed: false };
            let persons = { name: 'foo' };
            vm.removePerson(persons, person);
            expect(person.removeConfirmed).toBe(true);
        });

    });

    describe('function removeStaff', () => {
        it('should call service.removeRelationship', () => {
            spyOn(vm.service, 'removeRelationship');
            let staff = 'foo';
            vm.removeStaff(staff);
            expect(vm.service.removeRelationship).toHaveBeenCalledWith(
                staff,
                vm.newStaff,
                vm.people.staff.data,
                vm.removeToStaff
            );
        });
    });

    describe('function update', () => {

        it('should call createCommitteeMembers', () => {
            spyOn(vm, 'createCommitteeMembers');
            vm.update();
            expect(vm.createCommitteeMembers).toHaveBeenCalled();
        });

        it('should call createStaff', () => {
            spyOn(vm, 'createStaff');
            vm.update();
            expect(vm.createStaff).toHaveBeenCalled();
        });

        it('should call updateCommitteeMembers with true', () => {
            spyOn(vm, 'updateCommitteeMembers');
            vm.update();
            expect(vm.updateCommitteeMembers).toHaveBeenCalledWith(true);
        });

        it('should call updateCommitteeMembers with nothing', () => {
            spyOn(vm, 'updateCommitteeMembers');
            vm.update();
            expect(vm.updateCommitteeMembers).toHaveBeenCalledWith();
        });

        it('should call updateStaff with true', () => {
            spyOn(vm, 'updateStaff');
            vm.update();
            expect(vm.updateStaff).toHaveBeenCalledWith(true);
        });

        it('should call updateStaff with nothing', () => {
            spyOn(vm, 'updateStaff');
            vm.update();
            expect(vm.updateStaff).toHaveBeenCalledWith();
        });

        describe('in $q.all', () => {

            beforeEach(() => {
                vm.$q.all = () => { return { then: (f) => { f() } } };
            });

            it('should call $q.all with 6 promises', () => {
                let promises;
                vm.$q.all = (ps) => {
                    promises = ps;
                    return { then: (f) => { f() } };
                };
                vm.update();
                expect(promises.length).toEqual(6);
            });

            it('should set newCommitteeMembers to []', () => {
                vm.newCommitteeMembers = 'foo';
                vm.update();
                expect(vm.newCommitteeMembers).toEqual([]);
            });

            it('should set newStaff to []', () => {
                vm.newStaff = 'bar';
                vm.update();
                expect(vm.newStaff).toEqual([]);
            });

            it('should set removeToCommitteeMembers to []', () => {
                vm.removeToCommitteeMembers = 'baz';
                vm.update();
                expect(vm.removeToCommitteeMembers).toEqual([]);
            });

            it('should set removeToStaff to []', () => {
                vm.removeToStaff = 'qux';
                vm.update();
                expect(vm.removeToStaff).toEqual([]);
            });

            it('should call $scope.$emit with constants.Events.Update.People.Done', () => {
                spyOn(vm.$scope, '$emit');
                vm.update();
                expect(vm.$scope.$emit).toHaveBeenCalledWith(constants.Events.Update.People.Done);
            });

            it('should call $scope.$emit with constants.Events.Update.People.Done', () => {
                vm.$q.all = () => { return { then: (f, e) => { e() } } };
                spyOn(vm.$scope, '$emit');
                vm.update();
                expect(vm.$scope.$emit).toHaveBeenCalledWith(constants.Events.Update.People.Error);
            });

        });

    });

    describe('function updateCommitteeMembers', () => {

        it('should call service.updateRelationship with removeToCommitteeMembers and "updateCommitteeMembers" if removing', () => {
            spyOn(vm.service, 'updateRelationship');
            vm.updateCommitteeMembers(true);
            expect(vm.service.updateRelationship).toHaveBeenCalledWith(vm.removeToCommitteeMembers, 'updateCommitteeMembers', 0);
        });

        it('should call service.updateRelationship with people.committeeMembers.data and "updateCommitteeMembers" if not removing', () => {
            spyOn(vm.service, 'updateRelationship');
            vm.newCommitteeMembers = [1, 2, 3, 4];
            vm.updateCommitteeMembers(false);
            expect(vm.service.updateRelationship).toHaveBeenCalledWith(vm.people.committeeMembers.data, 'updateCommitteeMembers', 4);
        });

    });

    describe('function updateStaff', () => {

        it('should call service.updateRelationship with removeToStaff and "updateStaff" if removing', () => {
            spyOn(vm.service, 'updateRelationship');
            vm.updateStaff(true);
            expect(vm.service.updateRelationship).toHaveBeenCalledWith(vm.removeToStaff, 'updateStaff', 0);
        });

        it('should call service.updateRelationship with people.committeeMembers.data and "updateStaff" if removing', () => {
            spyOn(vm.service, 'updateRelationship');
            vm.newStaff = [1, 2, 3, 4, 5];
            vm.updateStaff(false);
            expect(vm.service.updateRelationship).toHaveBeenCalledWith(vm.people.committeeMembers.data, 'updateStaff', 5);
        });

    });

});
