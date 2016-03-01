import BorderStationController from './borderStation.controller';
import BorderStationService from './borderStation.service'
import constants from './constants'

describe('BorderStationController', () => {
    let vm;

    beforeEach(inject(function($rootScope, $timeout, $http, $q){
        //let scope = $rootScope.$new();
        let $state = null,
            $stateParams = {id: true},
            bss = new BorderStationService($http, $q);

        vm = new BorderStationController($rootScope, $state, $stateParams, $timeout, bss);

        //vm = new BorderStationController('BorderStationController', {$scope: scope});
    }));

    describe('function constructor', function(){

        it('loading should be false',function(){
            expect(vm.loading).toBeFalsy();
        });

        it('modifyDetailDone should be false',function(){
            expect(vm.modifyDetailDone).toBeFalsy();
        });

        it('updateLocationDone should be false',function(){
            expect(vm.updateLocationDone).toBeFalsy();
        });

        it('updatePeopleDone should be false',function(){
            expect(vm.updatePeopleDone).toBeFalsy();
        });

        it('updateStatusText should be constants.UpdateButtonText.Default',function(){
            //needs the constant file to work
        });

        it('updateStatusText should be constants.UpdateButtonText.Create',function(){
            //needs the constant file to work
        });

    });

    describe('function checkDone', function(){
        it('',function(){
            //needs the constant file to work
        });
    });

    describe('function createListeners', function(){
        it('createModifyDoneListeners should have been called',function(){
            spyOn(vm,"createModifyDoneListeners");
            vm.createListeners();
            expect(vm.createModifyDoneListeners).toHaveBeenCalled();
        });

        it('createUpdateErrorListeners should have been called',function(){
            spyOn(vm,"createUpdateErrorListeners");
            vm.createListeners();
            expect(vm.createUpdateErrorListeners).toHaveBeenCalled();
        });

    });

    describe('function createModifyDoneListeners', function(){
        it('$on should be called 4 times',function(){
            spyOn(vm.$scope,"$on");
            vm.createModifyDoneListeners();
            expect(vm.$scope.$on).toHaveBeenCalledTimes(4);
        });

        it('listener.status should be true',function(){
            //needs the constant file to work
            //spyOn(vm.$scope,"$on");
            //vm.createModifyDoneListeners();
            //expect(vm["modifyDetailDone"]).toEqual(true);
        });


    });

    describe('function createUpdateErrorListeners', function(){
        it('$on should be called 4 times',function(){
            spyOn(vm.$scope,"$on");
            vm.createUpdateErrorListeners();
            expect(vm.$scope.$on).toHaveBeenCalledTimes(4);
        });

        it('updateStatusText should be equal to constants.UpdateButtonText.Error', function(){
            pending('Have troubles with $on function');
            vm.createUpdateErrorListeners();
            expect(vm.updateStatusText).toEqual(constants.UpdateButtonText.Error);
        });

    });

    describe('function getBorderStationData', function(){
        it("loading should be true",function(){
            vm.getBorderStationData();
            expect(vm.loading).toBe(true);
        });

        it("$scope.$broadcast should be constants.Events.Get.BorderStation",function(){

            spyOn(vm.$scope,"$broadcast");
            vm.getBorderStationData();
            expect(vm.$scope.$broadcast).toHaveBeenCalledWith(constants.Events.Get.BorderStation);
        });
    });

    describe('function updateStation', function(){
        it("updateStatusText should be Saving...", function(){
            vm.updateStation();
            expect(vm.updateStatusText).toEqual(constants.UpdateButtonText.Saving);
        });

        it("when service.borderStationId == true $scope.$broadcast should be constants.Events.Update.BorderStation",function(){
            spyOn(vm.$scope,"$broadcast");
            vm.service.borderStationId = true;
            vm.updateStation();
            expect(vm.$scope.$broadcast).toHaveBeenCalledWith(constants.Events.Update.BorderStation);
        });

        it("when service.borderStationId == null $scope.$broadcast should be constants.Events.Create.BorderStation",function(){
            spyOn(vm.$scope,"$broadcast");
            vm.service.borderStationId = null;
            vm.updateStation();
            expect(vm.$scope.$broadcast).toHaveBeenCalledWith(constants.Events.Create.BorderStation.Start);
        });
    });
});
