(function(){
    'use strict';
    describe('DashboardController',function(){
        var vm;
        beforeEach(module('tinyhandsFrontend'));

        beforeEach(inject(function($controller){
            vm= $controller('DashboardController');
        }));

        describe('function constructor',function(){
            it('showEvents should be true',function(){
              expect(vm.showEvents).toBeTruthy();
            });

            it('showTally should be true',function(){
                expect(vm.showTally).toBeTruthy();
            });

            it('showAddress2Layer shouw be true',function(){
                expect(vm.showAddress2Layer).toBeTruthy();
            });
        });

        describe('toggleAddress2Layer',function(){
            it('not sure yet',function(){
                spyOn(vm.$rootScope,'$emit');

                vm.toggleAddress2Layer();

                expect(vm.$rootScope.$emit).toHaveBeenCalledWith('toggleAddress2Layer',vm.showAddress2Layer);
            });
        });

    });
})();