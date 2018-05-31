import {
    IrfIndiaController
}
from "./india.component";

const DateTimeId = 4;
const OtherContactId = 92;
const OtherRedFlagId = 31;
const OtherSignId = 134;
const OtherWebsiteId = 244;

describe('IrfIndiaController', () => {
    let vm;
    beforeEach(() => {
        let IndiaService = {
            getIndiaIrf: () => ({
                then: () => {}
            }),
            getLocation: () => ({
                then: () => {}
            }),
            getStaff: () => ({
                then: () => {}
            }),
        };
        vm = new IrfIndiaController(IndiaService);
    });

    describe('function setValuesForOtherInputs', () => {
        beforeEach(() => {
            vm.questions = {
                DateTimeId: {
                    question_id: DateTimeId,
                    response: {
                        value: ''
                    }
                },
                OtherRedFlagId: {
                    question_id: OtherRedFlagId,
                    response: {
                        value: false
                    }
                },
                OtherContactId: {
                    question_id: OtherContactId,
                    response: {
                        value: false
                    }
                },
                OtherSignId: {
                    question_id: OtherSignId,
                    response: {
                        value: false
                    }
                },
                OtherWebsiteId: {
                    question_id: OtherWebsiteId,
                    response: {
                        value: false
                    }
                },
            };
        });

        it('should set other flags', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherRedFlag).toEqual(false);
            expect(vm.otherWebsite).toEqual(false);
            expect(vm.otherSign).toEqual(false);
        });

        it('when other red flag is false should set value to empty string', () => {
            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherRedFlagId].response.value).toEqual('');
        });

        it('when other website flag is false should set value to empty string', () => {
            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherWebsiteId].response.value).toEqual('');
        });

        it('when other sign flag is false should set value to empty string', () => {
            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherSignId].response.value).toEqual('');
        });

        it('when other red flag is true should leave value as is', () => {
            vm.questions[OtherRedFlagId].response.value = 'hello there I am a red flag';

            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherRedFlagId].response.value).toEqual('hello there I am a red flag');
        });

        it('when other sign flag is true should leave value as is', () => {
            vm.questions[OtherSignId].response.value = 'I am another sign flag';

            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherSignId].response.value).toEqual('I am another sign flag');
        });

        it('when other website flag is true should leave value as is', () => {
            vm.questions[OtherWebsiteId].response.value = 'I am another website flag';

            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherWebsiteId].response.value).toEqual('I am another website flag');
        });
    });

    describe('function setContactRadio', () => {
        beforeEach(() => {
            vm.questions = {
                OtherContactId: {
                    question_id: OtherContactId,
                    response: {
                        value: ''
                    }
                }
            };
        });

        it('when contactValue matches an item in Contacts leave it as is, leave otherContactString as is', () => {
            vm.setContactRadio();

            expect(vm.contactValue).toEqual('');
            expect(vm.otherContactString).toEqual('');
        });

        it('when contactValue does not match one of Contacts, change contactValue to other and otherContactString to string value', () => {
            vm.questions[OtherContactId].response.value = 'I am another contact';

            vm.setContactRadio();

            expect(vm.otherContactString).toEqual('I am another contact');
            expect(vm.contactValue).toEqual('Other');
        });
    });
});