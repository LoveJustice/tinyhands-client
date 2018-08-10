import {
    IrfBangladeshController
}
from "./bangladesh.component";

const DateId = 4;
const IrfNumberId = 1;
const OtherFamilyId = 82;
const OtherContactId = 92;
const SignedId = 151;

describe('IrfBangladeshController', () => {
    let vm;
    beforeEach(() => {
        let $scope = {
            $watch() {},
            $on() {}
        };
        let $uibModal = {
            open: () => ({
                result: {
                    then: (f) => f()
                }
            })
        };
        let IrfService = {
            getIrf: () => ({
                then: () => {}
            }),
            getLocation: () => ({
                then: () => {}
            }),
            getStaff: () => ({
                then: () => { }
            }),
            submitIrf: (countryId, id, response) => ({
                then: () => { }
            })
        };
        let $stateParams = {id:null,stationId:1,countryId:4,isViewing:false};
        let $state = {go: () => {}};
        vm = new IrfBangladeshController($scope, $uibModal, {}, IrfService, $stateParams, $state);
    });

    describe('function incrementRedFlags', () => {
        it('should add what is passed in', () => {
            vm.redFlagTotal = 0;

            vm.incrementRedFlags(42);

            expect(vm.redFlagTotal).toEqual(42);
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
                    questions: jasmine.any(Function),
                    isViewing: jasmine.any(Function),
                    modalActions: jasmine.any(Function),
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
                        address1: {id:null, name:''},
                        address2: {id:null, name:''},
                        phone: {},
                        nationality: {},
                    }
                }]
            });
        });
    });

    describe('function setRadioOther', () => {
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
