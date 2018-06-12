import {
    IrfNepalController
}
from "./nepal.component";

const DateId = 4;
const OtherFamilyId = 82;
const OtherContactId = 92;
const OtherRedFlagId = 31;
const OtherSignId = 134;
const OtherWebsiteId = 244;
const StaffConvincedId = 149;

describe('IrfNepalController', () => {
    let vm;
    beforeEach(() => {
        let $uibModal = {
            open: () => ({
                result: {
                    then: f => f()
                }
            })
        };
        let NepalService = {
            getNepalIrf: () => ({
                then: () => {}
            }),
            getLocation: () => ({
                then: () => {}
            }),
            getStaff: () => ({
                then: () => {}
            }),
        };
        vm = new IrfNepalController($uibModal, {}, NepalService);
    });

    describe('function openIntercepteeModal', () => {
        beforeEach(() => {
            vm.cards = [];
        });

        it('should call $uibModal open with appropriate options', () => {
            spyOn(vm.$uibModal, 'open').and.callThrough();

            vm.openIntercepteeModal([], true);

            expect(vm.$uibModal.open).toHaveBeenCalledWith({
                bindToController: true,
                controller: jasmine.any(Function),
                controllerAs: 'IntercepteeModalController',
                resolve: {
                    isAdd: jasmine.any(Function),
                    questions: jasmine.any(Function)
                },
                size: 'lg',
                templateUrl: jasmine.any(String)
            });
        });

        it('when isAdd is true should add responses to list of cards in then', () => {
            vm.openIntercepteeModal([], true);

            expect(vm.cards.length).toEqual(1);
            expect(vm.cards[0]).toEqual({
                responses: [{
                    question_id: 7,
                    response: {}
                }, {
                    question_id: 8,
                    response: {}
                }, {
                    question_id: 9,
                    response: {
                        gender: {},
                        name: {},
                        age: {},
                        address1: {},
                        address2: {},
                        phone: {},
                        nationality: {},
                    }
                }]
            });
        });
    });

    describe('function setValuesForOtherInputs', () => {
        beforeEach(() => {
            vm.questions = {
                [DateId]: {
                    question_id: [DateId],
                    response: {
                        value: ''
                    }
                },
                [OtherContactId]: {
                    question_id: OtherContactId,
                    response: {
                        value: false
                    }
                },
                [OtherFamilyId]: {
                    question_id: OtherFamilyId,
                    response: {
                        value: ''
                    }
                },
                [OtherRedFlagId]: {
                    question_id: OtherRedFlagId,
                    response: {
                        value: false
                    }
                },
                [OtherSignId]: {
                    question_id: OtherSignId,
                    response: {
                        value: false
                    }
                },
                [OtherWebsiteId]: {
                    question_id: OtherWebsiteId,
                    response: {
                        value: false
                    }
                },
                [StaffConvincedId]: {
                    question_id: StaffConvincedId,
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
            expect(vm.staffConvinced).toEqual(false);
        });
    });

    describe('function setOtherQuestionValues', () => {
        beforeEach(() => {
            vm.questions = {

                [OtherRedFlagId]: {
                    question_id: OtherRedFlagId,
                    response: {
                        value: false
                    }
                },
            };
        });

        it('when response value is false should return false and set response value to empty string', () => {
            let temp = vm.setOtherQuestionValues(OtherRedFlagId);

            expect(temp).toEqual(false);
            expect(vm.questions[OtherRedFlagId].response.value).toEqual('');
        });

        it('when response value is a string, should return true, leave response value as a string', () => {
            vm.questions[OtherRedFlagId].response.value = 'hello there I am a red flag';

            let temp = vm.setOtherQuestionValues(OtherRedFlagId);

            expect(temp).toEqual(true);
            expect(vm.questions[OtherRedFlagId].response.value).toEqual('hello there I am a red flag');
        });

    });

    describe('function setRadio', () => {
        beforeEach(() => {
            vm.questions = {
                [OtherContactId]: {
                    question_id: OtherContactId,
                    response: {
                        value: ''
                    }
                }
            };
        });

        it('when response value matches an item in values, return nothing', () => {
            vm.questions[OtherContactId].response.value = 'Police';

            let temp = vm.setRadio(vm.contacts, OtherContactId);

            expect(temp).toBeUndefined();
            expect(vm.questions[OtherContactId].response.value).toEqual('Police');
        });

        it('when response value is null leave it as it is, return nothing', () => {
            let temp = vm.setRadio(vm.contacts, OtherContactId);

            expect(temp).toBeUndefined();
            expect(vm.questions[OtherContactId].response.value).toEqual('');
        });

        it('when response value does not match one of items, change response value to Other return response value', () => {
            vm.questions[OtherContactId].response.value = 'I am another contact';

            let temp = vm.setRadio(vm.contacts, OtherContactId);

            expect(temp).toEqual('I am another contact');
            expect(vm.questions[OtherContactId].response.value).toEqual('Other');
        });
    });
});