import {
    IrfSouthAfricaController
}
from "./southAfrica.component";

const DateId = 4;
const IrfNumberId = 1;
const OtherFamilyId = 82;
const OtherContactId = 92;
const SignedId = 151;

describe('IrfSouthAfricaController', () => {
    let vm;
    beforeEach(() => {
        let $scope = {
            $watch() {},
            $on() {}
        };
        let $uibModal = {
            open: () => ({
                result: {
                    then: f => f()
                }
            })
        };
        let SouthAfricaService = {
            getSouthAfricaIrf: () => ({
                then: () => {}
            }),
            getLocation: () => ({
                then: () => {}
            }),
            getStaff: () => ({
                then: () => {}
            })
        };
        vm = new IrfSouthAfricaController($scope, $uibModal, {}, SouthAfricaService);
    });

    describe('function incrementRedFlags', () => {
        it('should add what is passed in', () => {
            vm.redFlagTotal = 0;

            vm.incrementRedFlags(42);

            expect(vm.redFlagTotal).toEqual(42);
        });
    });

    describe('function getErrorMessages', () => {
        beforeEach(() => {
            vm.messagesEnabled = true;
            vm.questions = {
                [IrfNumberId]: {
                    question_id: IrfNumberId,
                    response: {
                        value: 'MBZ950'
                    }
                },
            };
            vm.errorMessageIrfNumber = 'Must have a valid border station code in order to submit this form.';
            vm.errorMessageInterceptee = 'At least one interceptee must be recorded in order to submit this form.';
        });

        it('when messagesEnabled is false, return an empty array of errors', () => {
            vm.messagesEnabled = false;

            let empty = vm.getErrorMessages();

            expect(empty).toEqual([]);
        });

        it('when messagesEnabled is true, if response value of Irf number is null, should push invalid border station error message to returned array', () => {
            vm.questions[IrfNumberId].response.value = '';

            let errors = vm.getErrorMessages();

            expect(errors[0]).toEqual("Must have a valid border station code in order to submit this form.");
        });

        it('when messagesEnabled is true, and size of cards array is 0, push interceptee error message on returned array', () => {
            vm.cards = [];

            let errors = vm.getErrorMessages();

            expect(errors[0]).toEqual('At least one interceptee must be recorded in order to submit this form.');
        });

        it('when messagesEnabled is true, response value of Irf Number is null, and size of cards array is 0, push invalid border station and interceptee error message on returned array', () => {
            vm.questions[IrfNumberId].response.value = '';
            vm.cards = [];

            let errors = vm.getErrorMessages();

            expect(errors[0]).toEqual('Must have a valid border station code in order to submit this form.');
            expect(errors[1]).toEqual('At least one interceptee must be recorded in order to submit this form.');
        });
    });

    describe('function getWarningMessages', () => {
        beforeEach(() => {
            vm.messagesEnabled = true;
            vm.ignoreWarnings = false;
            vm.questions = {
                [SignedId]: {
                    question_id: SignedId,
                    response: {
                        value: 'MBZ950'
                    }
                },
            };
            vm.warningMessageRedFlags = 'No red flags are checked. Are you sure you want to submit this form?';
            vm.warningMessageNoSignature = 'Paper form should be signed, though this is not required. Are you sure you want to submit this form?';
        });

        it('when messagesEnabled is false, return an empty array of warnings', () => {
            vm.messagesEnabled = false;

            let empty = vm.getWarningMessages();

            expect(empty).toEqual([]);
        });

        it('when ignoreWarnings is true, return an empty array of warnings', () => {
            vm.ignoreWarnings = true;

            let empty = vm.getWarningMessages();

            expect(empty).toEqual([]);
        });

        it('when messagesEnabled is true and ignoreWarnings is false, if redFlag total is 0, should push red flag warning on returned array ', () => {
            vm.redFlagTotal = 0;

            let errors = vm.getWarningMessages();

            expect(errors[0]).toEqual('No red flags are checked. Are you sure you want to submit this form?');
        });

        it('when messagesEnabled is true, ignoreWarnings is false, and signed is false, push not signed warning on returned array', () => {
            vm.questions[SignedId].response.value = false;

            let errors = vm.getWarningMessages();

            expect(errors[0]).toEqual('Paper form should be signed, though this is not required. Are you sure you want to submit this form?');
        });

        it('when messagesEnabled is true, ignoreWarnings is false, RedFlagTotal is 0, and signature is false, push invalid border station and interceptee error message on returned array', () => {
            vm.questions[SignedId].response.value = false;
            vm.redFlagTotal = 0;

            let errors = vm.getWarningMessages();

            expect(errors[0]).toEqual('Paper form should be signed, though this is not required. Are you sure you want to submit this form?');
            expect(errors[1]).toEqual('No red flags are checked. Are you sure you want to submit this form?');
        });
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
                        birthdate: {},
                        address1: {},
                        address2: {},
                        phone: {},
                        nationality: {},
                    }
                }]
            });
        });
    });

    describe('function save', () => {
        it('should set messagesEnabled to true and call getErrorMessages and getWarningMessages', () => {
            vm.messagesEnabled = false;
            spyOn(vm, 'getErrorMessages');
            spyOn(vm, 'getWarningMessages');

            vm.save();

            expect(vm.messagesEnabled).toEqual(true);
            expect(vm.getErrorMessages).toHaveBeenCalled();
            expect(vm.getWarningMessages).toHaveBeenCalled();
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

            let temp = vm.setRadioOther(vm.contacts, OtherContactId);

            expect(temp).toBeUndefined();
            expect(vm.questions[OtherContactId].response.value).toEqual('Police');
        });

        it('when response value is null leave it as it is, return nothing', () => {
            let temp = vm.setRadioOther(vm.contacts, OtherContactId);

            expect(temp).toBeUndefined();
            expect(vm.questions[OtherContactId].response.value).toEqual('');
        });

        it('when response value does not match one of items, change response value to Other return response value', () => {
            vm.questions[OtherContactId].response.value = 'I am another contact';

            let temp = vm.setRadioOther(vm.contacts, OtherContactId);

            expect(temp).toEqual('I am another contact');
            expect(vm.questions[OtherContactId].response.value).toEqual('Other');
        });
    });

    describe('function setupFlagListener', () => {
        it('should call incrementRedFlags with data from $on', () => {
            vm.$scope.$on = (a, b) => b({}, {
                numberOfFlagsToAdd: 21,
            });
            spyOn(vm, 'incrementRedFlags');

            vm.setupFlagListener();

            expect(vm.incrementRedFlags).toHaveBeenCalledWith(21);
        });
    });

    describe('function setValuesForOtherInputs', () => {
        beforeEach(() => {
            vm.questions = {
                [DateId]: {
                    question_id: [DateId],
                    response: {
                        value: '2017-04-23T19:45:00+05:45'
                    }
                },
                [OtherContactId]: {
                    question_id: OtherContactId,
                    response: {
                        value: 'boots'
                    }
                },
                [OtherFamilyId]: {
                    question_id: OtherFamilyId,
                    response: {
                        value: 'great uncle'
                    }
                }
            };
        });

        it('should set value for date', () => {
            vm.setValuesForOtherInputs();

            let expectedDate = new Date('April 23, 2017 10:00:00 GMT-0400');
            expect(vm.questions[DateId].response.value).toEqual(expectedDate);
        });

        it('should set value for otherContactString', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherContactString).toEqual('boots');
        });

        it('should set value for otherFamilyString', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherFamilyString).toEqual('great uncle');
        });
    });

    describe('function submit', () => {
        it('should set messagesEnabled to true and call getErrorMessages and getWarningMessages', () => {
            vm.messagesEnabled = false;
            spyOn(vm, 'getErrorMessages');
            spyOn(vm, 'getWarningMessages');

            vm.submit();

            expect(vm.getErrorMessages).toHaveBeenCalled();
            expect(vm.getWarningMessages).toHaveBeenCalled();
            expect(vm.messagesEnabled).toEqual(true);
        });
    });

    describe('function watchMessages', () => {
        it('should set watches on to call this.getErrorMessages when cards changes', () => {
            vm.$scope.$watch = (a, b) => b([], ["hello"]);
            spyOn(vm, 'getErrorMessages');

            vm.watchMessages();

            expect(vm.getErrorMessages).toHaveBeenCalled();
        });
        it('should set watches on to call this.getWarningMessages when redFlagTotal', () => {
            vm.$scope.$watch = (a, b) => b(0, 500);
            spyOn(vm, 'getErrorMessages');

            vm.watchMessages();

            expect(vm.getErrorMessages).toHaveBeenCalled();
        });
    });
});