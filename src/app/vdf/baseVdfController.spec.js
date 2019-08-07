import {BaseVdfController} from "./baseVdfController";
import {BaseModalController} from '../baseModalController.js';

/* global moment */

const IdConstants = {
        TotalFlagId:451,
        
        Person:[292],
        Address:[],
        RadioOther:[305,339],
        Date:[288],
        RadioItems:{
            "289":[
                ['Intercept', 'Operation'],
                ['Victim', 'Police'],
                ['Trafficker', 'OSI'],
            ],
            "305":['Father', 'Mother', 'Uncle', 'Aunt', 'Brother', 'Sister',
                'Other Relative', 'Friend', 'Agent', 'Boyfriend', 'Neighbor', 'Recently Met'],
            "339":['Delhi, India', 'Gorakhpur, India', 'Unknown location in India',
                'Unknown Gulf location', 'Kuwait', 'Dubai, UAE', "Don't Know"]
        },
        
        OtherPotentialVictims: {
            Category:40,
            Person: [300],
            Address:[],
            Basic:[301],
            Date:[],
            RadioOther:[],
            RadioItems:{},
        },
    };

class VdfTestController extends BaseVdfController {
    constructor($scope, $uibModal, constants, VdfService, $stateParams, $state) {
        'ngInject';        
        super($scope, $uibModal, constants, VdfService, $stateParams, $state);
        this.config = IdConstants;
       
        
    }
}

describe('VdfTestController', () => {
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
        let VdfService = {
            getVdf: () => ({
                then: () => {}
            }),
            submitVdf: (countryId, id, response) => ({
                then: () => { }
            }),
            getFormConfig: (formName) => ({
                then: () => { }
            })
        };
        let $stateParams = {id:null,stationId:1,countryId:4,isViewing:false};
        let $state = {go: () => {}};
        vm = new VdfTestController($scope, $uibModal, {}, VdfService, $stateParams, $state, IdConstants);
    });

    describe('function incrementRedFlags', () => {
        it('should add what is passed in', () => {
            vm.redFlagTotal = 0;

            vm.incrementRedFlags(42);

            expect(vm.redFlagTotal).toEqual(42);
        });
    });


    describe('function openCommonModal', () => {
        beforeEach(() => {
            vm.response = {
                    cards:[
                        {
                            category_id: 40,
                            instances:[]
                        }
                    ]
            };
            
        });

        it('should call $uibModal open with appropriate options', () => {
            spyOn(vm.$uibModal, 'open').and.callThrough();

            vm.commonModal(null, true, null, BaseModalController, 'PotentialVictimModalController',
                    'Template', 'OtherPotentialVictims');

            expect(vm.$uibModal.open).toHaveBeenCalledWith({
                bindToController: true,
                controller: jasmine.any(Function),
                controllerAs: jasmine.any(String),
                resolve: {
                    isAdd: jasmine.any(Function),
                    card: jasmine.any(Function),
                    isViewing: jasmine.any(Function),
                    modalActions: jasmine.any(Function),
                    config: jasmine.any(Function),
                    associatedPersons: jasmine.any(Function)
                },
                size: 'lg',
                templateUrl: jasmine.any(String)
            });
        });

        it('when isAdd is true should add responses to list of cards in then', () => {
            vm.commonModal(null, true, null, BaseModalController, 'PotentialVictimModalController',
                    'Template', 'OtherPotentialVictims');

            expect(vm.response.cards[0].instances.length).toEqual(1);
            expect(vm.response.cards[0].instances[0]).toEqual({
                storage_id: null,
                flag_count: 0,
                responses: [
                        Object(
                                {
                                        question_id: 300,
                                        response: Object(
                                                {
                                                        gender: Object({ value: '' }),
                                                        name: Object({  }),
                                                        age: Object({  }),
                                                        birthdate: Object({  }),
                                                        address1: Object({ id: null, name: '' }),
                                                        address2: Object({ id: null, name: '' }),
                                                        phone: Object({  }),
                                                        nationality: Object({  }),
                                                        identifiers: Object({ })
                                                }
                                        )
                                }
                        ),
                        Object(
                                {
                                        question_id: 301,
                                        response: Object({ value: null })
                                }
                        )
                ]
        });
        });
    });

    describe('function setupFlagListener', () => {
        it('should call incrementRedFlags with data from $on', () => {
            vm.$scope.$on = (a, b) => b({}, {
                numberOfFlagsToAdd: 21,
            });
            spyOn(vm, 'incrementRedFlags');

            vm.setupFlagListener();

            expect(vm.incrementRedFlags).toHaveBeenCalledWith(21, undefined);
        });
    });

    describe('function setValuesForOtherInputs', () => {
        beforeEach(() => {
            vm.questions = {
                [305]: {
                    question_id: 305,
                    response: {
                        value: 'great uncle'
                    }
                },
                [339]: {
                    question_id: 339,
                    response: {
                        value: 'India'
                    }
                },
            };
        });

        it('should set value for value for relation (question 305) in otherData', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherData.questions[305].otherValue).toEqual('great uncle');
        });

        it('should set value for other 339 in otherData', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherData.questions[339].otherValue).toEqual('India');
        });
    });
    
    describe('function setValuesForDateInputs', () => {
        beforeEach(() => {
            vm.questions = {
                [288]: {
                    question_id: [288],
                    response: {
                        value: '2018-10-29'
                    }
                },
                [292]: {
                    question_id: [292],
                    response: {

                        "storage_id": null,
                        "name": {
                            "value": ""
                        },
                        "address1": {
                            "id": null,
                            "name": ""
                        },
                        "address2": {
                            "id": null,
                            "name": ""
                        },
                        "phone": {
                            "value": ""
                        },
                        "gender": {
                            "value": ""
                        },
                        "age": {
                            "value": null
                        },
                        "birthdate": {
                            "value":"2018-10-30"
                        },
                        "passport": {
                            "value": ""
                        },
                        "nationality": {
                            "value": ""
                        }
                    }
                }
            };
        });

        it('should set value for date', () => {
            vm.setValuesForDateInputs();

            let expectedDate = new Date('Oct 29 2018 00:00:00 GMT');
            expect(vm.dateData.questions[288].value).toEqual(expectedDate);
        });
        
        it('should set value for birthdate', () => {
            vm.setValuesForDateInputs();

            let expectedDate = new Date('Oct 30 2018 00:00:00 GMT');
            expect(vm.dateData.questions[292].value).toEqual(expectedDate);
        });
    });


});
