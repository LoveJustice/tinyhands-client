import {
    FormStepController
}
    from "./form-step.component";

describe('FormStepController', () => {
    let vm;

    beforeEach(() => {
        let $scope = {
            $emit() { },
            $watch() { }
        };
        vm = new FormStepController($scope);
        vm.responseValue = false;
        vm.redFlag = 35;
    });

    describe('function $onInit', () => {
        it('should call setFlagSend with newValue and oldValue if redFlag is a number', () => {
            vm.redFlag = 2000;
            vm.$scope.$watch = (a, b) => b(true, false);

            spyOn(vm, 'setFlagSend');

            vm.$onInit();

            expect(vm.setFlagSend).toHaveBeenCalledWith(true, false);
        });

        it('should call setOtherQuestionValues', () => {
            spyOn(vm, 'setOtherQuestionValues');

            vm.$onInit();

            expect(vm.setOtherQuestionValues).toHaveBeenCalled();
        });

        it('should not call setFlagSend if redFlag is not a number', () => {
            vm.redFlag = undefined;
            vm.$scope.$watch = (a, b) => b(true, false);
            spyOn(vm, 'setFlagSend');

            vm.$onInit();

            expect(vm.setFlagSend).toHaveBeenCalledTimes(0);
        });
    });

    describe('clickRadio', () => {
        let tempEvent;
        beforeEach(() => {
            tempEvent = new Event('yas');
        });

        it('when responseValue equals label, should set responseValue to empyty string', () => {
            vm.responseValue = 'Goldfish';
            vm.label = 'Goldfish';

            vm.clickRadio(tempEvent);

            expect(vm.responseValue).toEqual('');
        });

        it('when responseValue does not equal this.label, should set responseValue to label', () => {
            vm.responseValue = 'Doritos';
            vm.label = 'Coke';

            vm.clickRadio(tempEvent);

            expect(vm.responseValue).toEqual('Coke');
        });
    });

    describe('function emitFlag()', () => {
        it('should call $emit with flagTotalCheck and object', () => {
            spyOn(vm.$scope, '$emit');

            vm.emitFlag(35);

            expect(vm.$scope.$emit).toHaveBeenCalledWith('flagTotalCheck', {
                numberOfFlagsToAdd: 35,
            });
        });
    });

    describe('function setFlagSend', () => {

        it('when newValue and oldValue are true, should call emit flag with red flag', () => {
            spyOn(vm, 'emitFlag');
            vm.redFlag = 2800;
            vm.setFlagSend(true, true);

            expect(vm.emitFlag).toHaveBeenCalledWith(2800);
        });

        it('when newValue and oldValue are false, should do nothing', () => {
            spyOn(vm, 'emitFlag');
            vm.redFlag = 2800;
            vm.setFlagSend(false, false);

            expect(vm.emitFlag).toHaveBeenCalledTimes(0);
        });

        it('when newValue is true and oldValue is false, should call emit flag with red flag', () => {
            spyOn(vm, 'emitFlag');
            vm.redFlag = 500000;
            vm.setFlagSend(true, false);

            expect(vm.emitFlag).toHaveBeenCalledWith(500000);
        });

        it('when newValue is false and oldValue is true, should call emit flag with red flag', () => {
            spyOn(vm, 'emitFlag');
            vm.redFlag = 420;
            vm.setFlagSend(false, true);

            expect(vm.emitFlag).toHaveBeenCalledWith(-420);
        });
    });

    describe('function setOtherQuestionValues', () => {
        beforeEach(() => {
            vm.type = 'otherCheckbox';
        });

        it('when value is not otherCheckbox should do nothing', () => {
            vm.type = 'blah';
            vm.responseValue = 'feet';
            vm.otherValue = false;

            vm.setOtherQuestionValues();

            expect(vm.responseValue).toEqual('feet');
            expect(vm.otherValue).toBeFalsy();
        });

        it('when response value is false should return false and set response value to empty string', () => {
            vm.setOtherQuestionValues();

            expect(vm.otherValue).toEqual(false);
            expect(vm.responseValue).toEqual('');
        });

        it('when response value is a string, should return true, leave response value as a string', () => {
            vm.responseValue = 'hello there I am a red flag';

            vm.setOtherQuestionValues();

            expect(vm.otherValue).toEqual(true);
            expect(vm.responseValue).toEqual('hello there I am a red flag');
        });
    });
});