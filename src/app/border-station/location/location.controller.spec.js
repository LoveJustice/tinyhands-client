import LocationController from './location.controller';
import BorderStationService from './../borderStation.service';
import constants from './../constants';

describe('LocationController', () => {
    let vm, q, $scope, bss;

    beforeEach(inject(($q, $http) => {
        let mockUtilService = jasmine.createSpyObj('mockUtilService', ['handleErrors']);
        bss = new BorderStationService($http, mockUtilService, $q);
        $scope = { $on: () => { }, $emit: () => { } };
        q = $q;
        vm = new LocationController($q, $scope, bss);
    }));

    describe('function constructor', () => {

        it('should set locations to []', () => {
            expect(vm.locations).toEqual([]);
        });

        it('should set newLocations to []', () => {
            expect(vm.newLocations).toEqual([]);
        });

        it('should set removeToLocations to []', () => {
            expect(vm.removeToLocations).toEqual([]);
        });

        it('should call getLocations if service.borderStationId', () => {
            spyOn(vm, 'getLocations');
            vm.service.borderStationId = 1;
            vm.constructor(q, $scope, bss);
            expect(vm.getLocations).toHaveBeenCalled();
        });

        it('should call createListeners', () => {
            spyOn(vm, 'createListeners');
            vm.constructor(q, $scope, bss);
            expect(vm.createListeners).toHaveBeenCalled();
        });

    });

    describe('function addLocation', () => {

        it('should add {border_station: 123} to newLocations', () => {
            vm.locations = [];
            vm.service.borderStationId = 123;
            vm.addLocation();
            expect(vm.newLocations).toEqual([{ border_station: 123 }]);
        });

        it('should add {border_station: 123} to locations', () => {
            vm.locations = [];
            vm.service.borderStationId = 123;
            vm.addLocation();
            expect(vm.locations).toEqual([{ border_station: 123 }]);
        });

    });

    describe('function createLocations', () => {
        it('should call createRelationship', () => {
            spyOn(vm.service, 'createRelationship');
            vm.createLocations();
            expect(vm.service.createRelationship).toHaveBeenCalledWith(vm.newLocations, 'createLocation');
        });
    });

    describe('function createListeners', () => {

        beforeEach(() => {
            vm.$scope.$on = (_, f) => { f() };
        });

        it('should call service.setBorderStationIdOfData with 123', () => {
            spyOn(vm.service, 'setBorderStationIdOfData');
            vm.newLocations = 123;
            vm.createListeners();
            expect(vm.service.setBorderStationIdOfData).toHaveBeenCalledWith(123);
        });

        it('should call service.setBorderStationIdOfData with 321', () => {
            spyOn(vm.service, 'setBorderStationIdOfData');
            vm.locations = 321;
            vm.createListeners();
            expect(vm.service.setBorderStationIdOfData).toHaveBeenCalledWith(321);
        });

        it('should call getLocations', () => {
            spyOn(vm, 'getLocations');
            vm.createListeners();
            expect(vm.getLocations).toHaveBeenCalled();
        });

        it('should call update', () => {
            spyOn(vm, 'update');
            vm.createListeners();
            expect(vm.update).toHaveBeenCalled();
        });

    });

    describe('function getLocations', () => {

        it('should call service.getLocations', () => {
            spyOn(vm.service, 'getLocations').and.callThrough();
            vm.getLocations();
            expect(vm.service.getLocations).toHaveBeenCalled();
        });

        it('should set locations to 123', () => {
            let response = { data: { results: 123 } };
            vm.service.getLocations = () => { return { then: (f) => f(response) } };
            vm.getLocations();
            expect(vm.locations).toEqual(123);
        });

    });

    describe('function removeLocation', () => {

        it('should call service.removeRelationship', () => {
            let loc = { removeConfirmed: true };
            spyOn(vm.service, 'removeRelationship');
            vm.removeLocation(loc);
            expect(vm.service.removeRelationship).toHaveBeenCalledWith(loc, vm.newLocations, vm.locations, vm.removeToLocations);
        });

        it('should set location.removeConfirmed to true', () => {
            let loc = { removeConfirmed: false };
            vm.removeLocation(loc);
            expect(loc.removeConfirmed).toBe(true);
        });

    });

    describe('function update', () => {

        it('should call createLocations', () => {
            spyOn(vm, 'createLocations');
            vm.update();
            expect(vm.createLocations).toHaveBeenCalled();
        });

        it('should call updateLocations with true', () => {
            spyOn(vm, 'updateLocations');
            vm.update();
            expect(vm.updateLocations).toHaveBeenCalledWith(true);
        });

        it('should call updateLocations', () => {
            spyOn(vm, 'updateLocations');
            vm.update();
            expect(vm.updateLocations).toHaveBeenCalled();
        });

        it('should set newLocations to []', () => {
            vm.$q.all = () => { return { then: (f) => f() } };
            vm.update();
            expect(vm.newLocations).toEqual([]);
        });

        it('should set removeToLocations to []', () => {
            vm.$q.all = () => { return { then: (f) => f() } };
            vm.update();
            expect(vm.removeToLocations).toEqual([]);
        });

        it('should call $scope.$emit', () => {
            vm.$q.all = () => { return { then: (f) => f() } };
            spyOn(vm.$scope, '$emit');
            vm.update();
            expect(vm.$scope.$emit).toHaveBeenCalledWith(constants.Events.Update.Location.Done);
        });

    });

    describe('function updateLocations', () => {

        it('should call service.updateRelationship with true', () => {
            spyOn(vm.service, 'updateRelationship');
            vm.updateLocations(true);
            expect(vm.service.updateRelationship).toHaveBeenCalledWith(vm.removeToLocations, 'updateLocations', 0);
        });

        it('should call service.updateRelationship with true', () => {
            spyOn(vm.service, 'updateRelationship');
            vm.updateLocations();
            expect(vm.service.updateRelationship).toHaveBeenCalledWith(vm.removeToLocations, 'updateLocations', vm.newLocations.length);
        });

    });

});
