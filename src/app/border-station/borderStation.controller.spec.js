(function(){
    'use strict';


    describe('BorderStationController',function(){
        var vm;
        beforeEach(module('tinyhandsFrontend'));

        beforeEach(inject(function($controller, $rootScope){
            var scope = $rootScope.$new();
            vm = $controller('BorderStationController', {$scope: scope});
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
                //needs the constant file to work
                //vm.createUpdateErrorListeners();
                //expect(vm.createUpdateErrorListeners).toEqual('Error');
            });

        });

        describe('function getBorderStationData', function(){
            it("loading should be true",function(){
                vm.getBorderStationData();

                expect(vm.loading).toBe(true);
            });

            it("$scope.$broadcast should be Get.BorderStation",function(){
               //needs the constant file to work
            });
        });

        describe('function updateStation', function(){
            it("updateStatusText should be Saving...", function(){
                //needs the constant file to work
            });

            it("when service.borderStationId == true $scope.$broadcast should be Update.BorderStation",function(){
                //needs the constant file to work
            });

            it("when service.borderStationId == null $scope.$broadcast should be Create.BorderStation",function(){
                //needs the constant file to work
            });
        });


    });
})();