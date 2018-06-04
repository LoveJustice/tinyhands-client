import {
    IrfIndiaController
} from "./india.component";

const DateId = 4;
const FamilyId = 82;
const OtherRedFlagId = 31;
const OtherWebsiteId = 244;

describe('IrfIndiaController', () => {
    let vm;
    beforeEach(() => {
        let $uibModal = {
            open: () => ({
                result: {
                    then: f => f()
                }
            })
        };
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
        vm = new IrfIndiaController($uibModal, IndiaService);
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
                [OtherRedFlagId]: {
                    question_id: OtherRedFlagId,
                    response: {
                        value: false
                    }
                },
                [FamilyId]: {
                    question_id: FamilyId,
                    response: {
                        value: 'Stuff'
                    }
                },
                [OtherWebsiteId]: {
                    question_id: OtherWebsiteId,
                    response: {
                        value: false
                    }
                }
            };
        });

        it('should set other flags', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherRedFlag).toEqual(false);
            expect(vm.otherWebsite).toEqual(false);
        });

        it('when other red flag is false should set value to empty string', () => {
            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherRedFlagId].response.value).toEqual('');
        });

        it('when other website flag is false should set value to empty string', () => {
            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherWebsiteId].response.value).toEqual('');
        });

        it('when other red flag is not false should set leave value as is', () => {
            vm.questions[OtherRedFlagId].response.value = 'hello there I am a red flag';

            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherRedFlagId].response.value).toEqual('hello there I am a red flag');
        });

        it('when other website flag is not false should set leave value as is', () => {
            vm.questions[OtherWebsiteId].response.value = 'I am an other website flag';

            vm.setValuesForOtherInputs();

            expect(vm.questions[OtherWebsiteId].response.value).toEqual('I am an other website flag');
        });

    });

    describe('function setFamilyRadio', () => {
        beforeEach(() => {
            vm.questions = {
                [FamilyId]: {
                    question_id: FamilyId,
                    response: {
                        value: 'Stuff'
                    }
                }
            };
        });

        it('when other family is not in family array should set other family string to other family value and family value to \'Other\'', () => {
            vm.setFamilyRadio();

            expect(vm.otherFamilyString).toEqual('Stuff');
            expect(vm.familyValue).toEqual('Other');
        });

        it('when family value is in family array should set the family value to family value', () => {
            vm.questions[FamilyId].response.value = '';

            vm.setFamilyRadio();

            expect(vm.questions[FamilyId].response.value).toEqual('');
        });
        it('when family value is an empty string, leave family string as the same value and family value as the same value', () => {
            vm.questions[FamilyId].response.value = '';

            vm.setFamilyRadio();

            expect(vm.questions[FamilyId].response.value).toEqual('');
        });
    });
});