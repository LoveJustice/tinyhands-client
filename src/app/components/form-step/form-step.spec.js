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
        it('should call setFlagSend with newValue and oldValue', () => {
            vm.$scope.$watch = (a, b) => b(true, false);

            spyOn(vm, 'setFlagSend');

            vm.$onInit();

            expect(vm.setFlagSend).toHaveBeenCalledWith(true, false);
        });
    });

    describe('function emitFlag()', () => {
        it('should call $emit with flagTotalCheck and object', () => {
            spyOn(vm.$scope, '$emit');

            vm.emitFlag(35);

            expect(vm.$scope.$emit).toHaveBeenCalledWith('flagTotalCheck', {
                flagAmount: 35,
            });
        });
    });

    describe('function setFlagSend', () => {

        it('when newValue and oldValue are true, call emit flag with red flag', () => {
            spyOn(vm, 'emitFlag');
            vm.redFlag = 2800;
            vm.setFlagSend(true, true);

            expect(vm.emitFlag).toHaveBeenCalledWith(2800);
        });

        it('when newValue and oldValue are false, do nothing', () => {
            spyOn(vm, 'emitFlag');
            vm.redFlag = 2800;
            vm.setFlagSend(false, false);

            expect(vm.emitFlag).toHaveBeenCalledTimes(0);
        });

        it('when newValue is true and oldValue is false, call emit flag with red flag', () => {
            spyOn(vm, 'emitFlag');
            vm.redFlag = 500000;
            vm.setFlagSend(true, false);

            expect(vm.emitFlag).toHaveBeenCalledWith(500000);
        });

        it('when newValue is false and oldValue is true, call emit flag with red flag', () => {
            spyOn(vm, 'emitFlag');
            vm.redFlag = 420;
            vm.setFlagSend(false, true);

            expect(vm.emitFlag).toHaveBeenCalledWith(-420);
        });
    });
});