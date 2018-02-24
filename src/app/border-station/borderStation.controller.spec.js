import BorderStationController from './borderStation.controller';
import BorderStationService from './borderStation.service'
import constants from './constants'

describe('BorderStationController', () => {
    let vm;
    let rootScope,
        state,
        stateParams,
        timeout,
        borderss,
        mockSessionService,
        mockToastr;

    beforeEach(inject(($rootScope, $timeout, $http, $q) => {
        state = { go: () => { } };
        rootScope = $rootScope;
        borderss = new BorderStationService($http, $q);
        stateParams = { id: true };
        timeout = $timeout;
        borderss = new BorderStationService($http, $q);

        mockSessionService = jasmine.createSpyObj('sessionService', ['me', 'checkPermission']);
        mockSessionService.me.and.callFake(() => {
            return $q.resolve({user: { permission_border_stations_add: true, permission_border_stations_edit: true}});
        });
        mockSessionService.checkPermission.and.callFake(() => {
            return false;
        });

        mockToastr = jasmine.createSpyObj('toastr', ['error']);

        vm = new BorderStationController(rootScope, state, stateParams, timeout, borderss, mockSessionService, mockToastr);
    }));


    describe('function constructor', () => {

        it('loading should be false', () => {
            expect(vm.loading).toBe(false);
        });

        it('modifyDetailDone should be false', () => {
            expect(vm.modifyDetailDone).toBe(false);
        });

        it('isViewing should be false', () => {
            expect(vm.isViewing).toBe(false);
        });

        it('updateLocationDone should be false', () => {
            expect(vm.updateLocationDone).toBe(false);
        });

        it('updatePeopleDone should be false', () => {
            expect(vm.updatePeopleDone).toBe(false);
        });

        it('when stateParams id is not null then updateStatusText should be "Update Station"', () => {
            vm.updateStatusText = null;
            vm.constructor(rootScope, state, { id: 1 }, timeout, borderss, mockSessionService, mockToastr);
            expect(vm.updateStatusText).toEqual(constants.UpdateButtonText.Default);
        });

        it('when stateParams id is equal to null then updateStatusText should be "Create Station"', () => {
            vm.updateStatusText = null;
            vm.constructor(rootScope, state, { id: null }, timeout, borderss, mockSessionService, mockToastr);
            expect(vm.updateStatusText).toEqual(constants.UpdateButtonText.Create);

        });
    });

    describe('function authorize', () => {
        it('when no add permission and the user is trying to add, should go to dashboard', () => {
            spyOn(state, 'go');            
            vm.authorize({permission_border_stations_add: false, permission_border_stations_edit: true}, "");
            expect(state.go).toHaveBeenCalledWith("dashboard");
        });

        it('when no add permission and the user is trying to add, should toast an error', () => {
            vm.authorize({permission_border_stations_add: false, permission_border_stations_edit: true}, "");
            expect(mockToastr.error).toHaveBeenCalled();
        });

        it('when the user is on a page with an id and does not have the edit permission, it should set isViewing to true', () => {
            vm.authorize({permission_border_stations_add: true, permission_border_stations_edit: false}, 1);
            expect(vm.isViewing).toBe(true);
        });

    });


    describe('function checkDone', () => {
        it('when modifyDetailDone, updateLocationDone and updatePeopleDone are true then updateStatusText should equal to "Update Station"', () => {
            vm.modifyDetailDone = true;
            vm.updateLocationDone = true;
            vm.updatePeopleDone = true;
            vm.$timeout = (f) => { f() };
            vm.updateStatusText = null;
            vm.checkDone();
            expect(vm.updateStatusText).toEqual(constants.UpdateButtonText.Default);
        });

        it('when modifyDetailDone, updateLocationDone and updatePeopleDone are true then go should be called with "dashboard" ', () => {
            vm.modifyDetailDone = true;
            vm.updateLocationDone = true;
            vm.updatePeopleDone = true;
            vm.$timeout = (f) => { f() };
            spyOn(vm.$state, 'go');
            vm.checkDone();
            expect(vm.$state.go).toHaveBeenCalledWith('dashboard');
        });


    });

    describe('function createListeners', () => {
        it('createModifyDoneListeners should have been called', () => {
            spyOn(vm, "createModifyDoneListeners");
            vm.createListeners();
            expect(vm.createModifyDoneListeners).toHaveBeenCalled();
        });

        it('createUpdateErrorListeners should have been called', () => {
            spyOn(vm, "createUpdateErrorListeners");
            vm.createListeners();
            expect(vm.createUpdateErrorListeners).toHaveBeenCalled();
        });

    });

    describe('function createModifyDoneListeners', () => {
        it('function on should be called 4 times', () => {
            spyOn(vm.$scope, "$on");
            vm.createModifyDoneListeners();
            expect(vm.$scope.$on.calls.count()).toEqual(4);
        });

        it('modifyDetailDone, updateLocationDone, and updatePeopleDone should equal to true', () => {
            spyOn(vm.$scope, "$on");
            vm.$scope.$on = (listener, f) => { f() };
            vm.modifyDetailDone = false;
            vm.updateLocationDone = false;
            vm.updatePeopleDone = false;
            vm.createModifyDoneListeners();
            expect(vm.modifyDetailDone).toEqual(true);
            expect(vm.updateLocationDone).toEqual(true);
            expect(vm.updatePeopleDone).toEqual(true);
        });


    });

    describe('function createUpdateErrorListeners', () => {
        it('function on should be called 4 times', () => {
            spyOn(vm.$scope, "$on");
            vm.createUpdateErrorListeners();
            expect(vm.$scope.$on.calls.count()).toEqual(4);
        });

        it('updateStatusText should be equal to "Error"', () => {
            vm.$scope.$on = (listener, f) => { f() };
            vm.updateStatusText = null;
            vm.createUpdateErrorListeners();
            expect(vm.updateStatusText).toEqual(constants.UpdateButtonText.Error);
        });

    });

    describe('function getBorderStationData', () => {
        it("loading should be equal to true", () => {
            vm.loading = null;
            vm.getBorderStationData();
            expect(vm.loading).toBe(true);
        });

        it('$scope.$broadcast should be equal to "Get.BorderStation"', () => {
            spyOn(vm.$scope, "$broadcast");
            vm.getBorderStationData();
            expect(vm.$scope.$broadcast).toHaveBeenCalledWith(constants.Events.Get.BorderStation);
        });
    });

    describe('function updateStation', () => {
        it('updateStatusText should be equal to "Saving..."', () => {
            vm.updateStatusText = null;
            vm.updateStation();
            expect(vm.updateStatusText).toEqual(constants.UpdateButtonText.Saving);
        });

        it('when service borderStationId is equal to true scope broadcast should be equal to "Update.BorderStation"', () => {
            spyOn(vm.$scope, "$broadcast");
            vm.service.borderStationId = true;
            vm.updateStation();
            expect(vm.$scope.$broadcast).toHaveBeenCalledWith(constants.Events.Update.BorderStation);
        });

        it('when service borderStationId is equal to null scope broadcast should be equal to "Create.BorderStation"', () => {
            spyOn(vm.$scope, "$broadcast");
            vm.service.borderStationId = null;
            vm.updateStation();
            expect(vm.$scope.$broadcast).toHaveBeenCalledWith(constants.Events.Create.BorderStation.Start);
        });
    });
});
