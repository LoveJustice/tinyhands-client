import {
    IrfIndiaController
} from "./india.component";

describe('IrfIndiaController', () => {
    let vm;
    beforeEach(() => {
        let IndiaService = {
            getIndiaIrf: () => ({
                then: () => {}
            })
        };
        vm = new IrfIndiaController(IndiaService);
    });

    describe('function setValuesForOtherInputs', () => {
        beforeEach(() => {
            vm.responses = [{
                question_id: 31,
                response: {
                    value: false
                }
            }, {
                question_id: 244,
                response: {
                    value: false
                }
            }];
        });

        it('should call getQuestionIndexById with 31 and set other flags', () => {
            spyOn(vm, 'getQuestionIndexById').and.returnValue(0);

            vm.setValuesForOtherInputs();

            expect(vm.getQuestionIndexById).toHaveBeenCalledWith(31);
            expect(vm.otherRedFlag).toEqual(false);
            expect(vm.otherWebsite).toEqual(false);
        });

        it('should call getQuestionIndexById with 244 and set other flags', () => {
            spyOn(vm, 'getQuestionIndexById').and.returnValue(0);

            vm.setValuesForOtherInputs();

            expect(vm.getQuestionIndexById).toHaveBeenCalledWith(244);
            expect(vm.otherRedFlag).toEqual(false);
            expect(vm.otherWebsite).toEqual(false);
        });

        it('when other red flag is false should set value to empty string', () => {
            vm.setValuesForOtherInputs();

            expect(vm.responses[0].response.value).toEqual('');
        });

        it('when other website flag is false should set value to empty string', () => {
            vm.setValuesForOtherInputs();

            expect(vm.responses[1].response.value).toEqual('');
        });

        it('when other red flag is not false should set leave value as is', () => {
            vm.responses[0].response.value = 'hello there I am a red flag';

            vm.setValuesForOtherInputs();

            expect(vm.responses[0].response.value).toEqual('hello there I am a red flag');
        });

        it('when other website flag is not false should set leave value as is', () => {
            vm.responses[1].response.value = 'I am an other website flag';

            vm.setValuesForOtherInputs();

            expect(vm.responses[1].response.value).toEqual('I am an other website flag');
        });
    });
});