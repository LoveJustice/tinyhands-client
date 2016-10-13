import DetailController from './detail.controller';
import BorderStationService from './../borderStation.service';
import constants from './../constants';

describe('DetailController', () => {
    let vm, scope, bss;

    beforeEach(inject(($http, $q) => {
        scope = {
            $on: () => { },
            $emit: () => { }
        };
        bss = new BorderStationService($http, $q);
        vm = new DetailController(scope, bss);
    }));

    describe('function constructor', () => {

        it('should set details to {}', () => {
            expect(vm.details).toEqual({});
        });

        it('should call createListeners', () => {
            spyOn(vm, 'createListeners');
            vm.constructor(scope, bss);
            expect(vm.createListeners).toHaveBeenCalled();
        });

        it('should call getDetails if service.borderStationId', () => {
            spyOn(vm, 'getDetails');
            vm.service.borderStationId = true;
            vm.constructor(scope, bss);
            expect(vm.getDetails).toHaveBeenCalled();
        });

    });

    describe('function changeStationStatus', () => {

        it('should toggle details.open', () => {
            vm.details.open = false;
            vm.changeStationStatus();
            expect(vm.details.open).toBe(true);
        });

        it('should toggle details.open', () => {
            vm.details.open = true;
            vm.changeStationStatus();
            expect(vm.details.open).toBe(false);
        });

    });

    describe('function create', () => {
        let response;

        beforeEach(() => {
            response = {
                data: {
                    id: 123
                }
            };
            vm.modifyDetails = () => {
                return {
                    then:
                    (f) => { f(response) }
                };
            };
        });

        it('should set details to response.data', () => {
            vm.details = null;
            vm.create();
            expect(vm.details).toEqual(response.data);
        });

        it('should set service.borderStationId to response.data.id', () => {
            vm.service.borderStationId = null;
            vm.create();
            expect(vm.service.borderStationId).toEqual(response.data.id);
        });

        it('should call $scope.emit', () => {
            spyOn(vm.$scope, '$emit');
            vm.create();
            expect(vm.$scope.$emit).toHaveBeenCalledWith(constants.Events.Create.BorderStation.Done);
        });

    });

    describe('function createListeners', () => {

        it('should call $scope.on with constants.Events.Create.BorderStation.Start', () => {
            spyOn(vm.$scope, '$on');
            vm.createListeners();
            expect(vm.$scope.$on.calls.argsFor(0)[0]).toEqual(constants.Events.Create.BorderStation.Start);
        });

        it('should call $scope.on with constants.Events.Get.BorderStation', () => {
            spyOn(vm.$scope, '$on');
            vm.createListeners();
            expect(vm.$scope.$on.calls.argsFor(1)[0]).toEqual(constants.Events.Get.BorderStation);
        });

        it('should call $scope.on with constants.Events.Update.BorderStation', () => {
            spyOn(vm.$scope, '$on');
            vm.createListeners();
            expect(vm.$scope.$on.calls.argsFor(2)[0]).toEqual(constants.Events.Update.BorderStation);
        });

        it('should call create', () => {
            spyOn(vm, 'create');
            vm.$scope.$on = (a, f) => { f() };
            vm.createListeners();
            expect(vm.create).toHaveBeenCalled();
        });

        it('should call getDetails', () => {
            spyOn(vm, 'getDetails');
            vm.$scope.$on = (a, f) => { f() };
            vm.createListeners();
            expect(vm.getDetails).toHaveBeenCalled();
        });

        it('should call update', () => {
            spyOn(vm, 'update');
            vm.$scope.$on = (a, f) => { f() };
            vm.createListeners();
            expect(vm.update).toHaveBeenCalled();
        });

    });

    describe('function formatDate', () => {
        it('should call window.moment', () => {
            spyOn(window, 'moment').and.callThrough();
            vm.formatDate();
            expect(window.moment).toHaveBeenCalled();
        });
    });

    describe('function getDetails', () => {

        it('should call service.getDetails', () => {
            spyOn(vm.service, 'getDetails').and.callThrough();
            vm.getDetails();
            expect(vm.service.getDetails).toHaveBeenCalled();
        });

        it('should set details to response.data', () => {
            let response = { data: 'foo' };
            vm.service.getDetails = () => {
                return {
                    then: (f) => { f(response) }
                };
            };
            vm.details = null;
            vm.getDetails();
            expect(vm.details).toEqual(response.data);
        });

    });

    describe('function update', () => {

        it('should call modifyDetails', () => {
            spyOn(vm, 'modifyDetails').and.callThrough();
            vm.update();
            expect(vm.modifyDetails).toHaveBeenCalled();
        });

        it('should call $scope.$emit', () => {
            spyOn(vm.$scope, '$emit');
            vm.modifyDetails = () => { return { then: (f) => { f() } } };
            vm.update();
            expect(vm.$scope.$emit).toHaveBeenCalledWith(constants.Events.Update.Detail.Done);
        });

    });

    describe('function modifyDetails', () => {

        it('should set details.date_established', () => {
            let date_established = 'foo';
            vm.details.date_established = date_established;
            vm.modifyDetails();
            expect(vm.details.date_established).toEqual(vm.formatDate(date_established));
        });

        it('should call service.updateRelationship if service.borderStationId', () => {
            spyOn(vm.service, 'updateRelationship');
            vm.service.borderStationId = true;
            vm.modifyDetails();
            expect(vm.service.updateRelationship).toHaveBeenCalledWith([vm.details], 'updateDetails');
        });

        it('should call service.createBorderStation', () => {
            spyOn(vm.service, 'createBorderStation');
            vm.modifyDetails();
            expect(vm.service.createBorderStation).toHaveBeenCalledWith(vm.details);
        });

    });

});
