import {
    FormStepController
}
from "./form-step.component";

describe('FormStepController', () => {
    let vm;

    beforeEach(() => {
        let $scope = {
            $emit() {},
            $watch() {}
        };
        vm = new FormStepController($scope);
        vm.responseValue = false;
        vm.redFlag = 35;
    });

    describe('function $onInit', () => {

        it('when class is initialized, should call emitFlag with true as initializing parameter', () => {
            vm.$scope.$watch = (a, b) => b(true, true);
            spyOn(vm, 'emitFlag');

            vm.$onInit();

            expect(vm.emitFlag).toHaveBeenCalledWith(true);
        });

        it('when responseValue changes, should call emitFlag with false as initializing parameter', () => {
            vm.$scope.$watch = (a, b) => b(true, false);
            spyOn(vm, 'emitFlag');

            vm.$onInit();

            expect(vm.emitFlag).toHaveBeenCalledWith(false);
        });
    });

    describe('function emitFlag()', () => {
        it('should call $emit with flagTotalCheck and object', () => {
            spyOn(vm.$scope, '$emit');

            vm.emitFlag(true);

            expect(vm.$scope.$emit).toHaveBeenCalledWith('flagTotalCheck', {
                flagNum: 35,
                flagValue: false,
                flagInitializing: true
            });
        });
    });
});