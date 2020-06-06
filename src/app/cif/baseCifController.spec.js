import {BaseCifController} from "./baseCifController";
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

class CifTestController extends BaseCifController {
	constructor($scope, $uibModal, constants, CifService, $stateParams, $state) {
        'ngInject';        
        super($scope, $uibModal, constants, CifService, $stateParams, $state);
        this.config = IdConstants;
    }
	
	getDefaultIdentificationTypes() {
        return ['TypeA', 'TypeB'];
    }
}

describe('CifTestController', () => {
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
        let CifService = {
            getCif: () => ({
                then: () => {}
            }),
            submitCif: (countryId, id, response) => ({
                then: () => { }
            }),
            getFormConfig: (formName) => ({
                then: () => { }
            })
        };
        let $stateParams = {id:null,stationId:1,countryId:4,isViewing:false};
        let $state = {go: () => {}};
        vm = new CifTestController($scope, $uibModal, {}, CifService, $stateParams, $state, IdConstants);
    });

    describe('function incrementRedFlags', () => {
        it('should add what is passed in', () => {
            vm.redFlagTotal = 0;

            vm.incrementRedFlags(42);

            expect(vm.redFlagTotal).toEqual(42);
        });
    });
    
    describe('function processPersonIdentificationIn', () => {
        it('should set person to question response when respone is null', () => {
            let question = {
                    response: null
            };

            vm.processPersonIdentificationIn(question);

            expect(question.response.storage_id).toEqual(null);
            expect(question.response.name).toEqual({value:''});
            expect(question.response.phone).toEqual({value:''});
            expect(question.response.gender).toEqual({value:''});
            expect(question.response.age).toEqual({value:null});
            expect(question.response.birthdate).toEqual({value:''});
            expect(question.response.nationality).toEqual({value:''});
            expect(question.response.identifiers).toEqual({
                TypeA: {type:{value:'TypeA'}, number:{value:''}, location:{value:''}},
                TypeB: {type:{value:'TypeB'}, number:{value:''}, location:{value:''}}
            });
        });
        it('should add missing default identifiers', () => {
            let question = {
                response: {
                    storage_id: null,
                    name: {value:'test name'},
                    phone:{value:''},
                    age:{value:''},
                    birthdate:{value:''},
                    nationality:{value:''},
                    identifiers: {
                        TypeA: {type:{value:'TypeA'}, number:{value:'ANumber'}, location:{value:'ALocation'}},
                        TypeC: {type:{value:'TypeC'}, number:{value:'CNumber'}, location:{value:'CLocation'}}
                    }
                    }
            };

            vm.processPersonIdentificationIn(question);
            expect(question.response.name).toEqual({value:'test name'});
            expect(question.response.identifiers).toEqual({
                TypeA: {type:{value:'TypeA'}, number:{value:'ANumber'}, location:{value:'ALocation'}},
                TypeC: {type:{value:'TypeC'}, number:{value:'CNumber'}, location:{value:'CLocation'}},
                TypeB: {type:{value:'TypeB'}, number:{value:''}, location:{value:''}}
            });
        });    
    });
    
    describe('function processPersonIdentificationOut', () => {
        it('should remove all identifiers from person when the are all empty', () => {
            let question = {
                    response: {
                        storage_id: null,
                        name: {value:'test name'},
                        phone:{value:''},
                        age:{value:''},
                        birthdate:{value:''},
                        nationality:{value:''},
                        identifiers: {
                            TypeA: {type:{value:'TypeA'}, number:{value:''}, location:{value:'ALocation'}},
                            TypeC: {type:{value:''}, number:{value:'CNumber'}, location:{value:'CLocation'}},
                        }
                    }
            };

            vm.processPersonIdentificationOut(question);

            expect(question.response.identifiers).toEqual({});
        });
        
        it('hould remove empty identifiers from person', () => {
            let question = {
                    response: {
                        storage_id: null,
                        name: {value:'test name'},
                        phone:{value:''},
                        age:{value:''},
                        birthdate:{value:''},
                        nationality:{value:''},
                        identifiers: {
                            TypeA: {type:{value:'TypeA'}, number:{value:'ANumber'}, location:{value:'ALocation'}},
                            TypeC: {type:{value:'TypeC'}, number:{value:''}, location:{value:'CLocation'}}
                        }
                    }
            };

            vm.processPersonIdentificationOut(question);
            expect(question.response.identifiers).toEqual({
                TypeA: {type:{value:'TypeA'}, number:{value:'ANumber'}, location:{value:'ALocation'}}
            });
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
                    identificationTypes: jasmine.any(Function),
                    associatedPersons: jasmine.any(Function),
                    checkboxGroupItems: jasmine.any(Function)
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
                                                        address: Object({  }),
                                                        address_notes: Object({  }),
                                                        phone: Object({  }),
                                                        nationality: Object({  }),
                                                        identifiers: {
                                                            TypeA: {type:{value:'TypeA'}, number:{value:''}, location:{value:''}},
                                                            TypeB: {type:{value:'TypeB'}, number:{value:''}, location:{value:''}}
                                                        },
                                                        latitude: Object({  }),
                                                        longitude: Object({  }),
                                                        appearance: Object({  }),
                                                        arrested: Object({  }),
                                                        case_filed_against: Object({  }),
                                                        education: Object({  }),
                                                        guardian_name: Object({  }),
                                                        guardian_phone: Object({  }),
                                                        guardina_relationship: Object({  }),
                                                        occupation: Object({  }),
                                                        photo: Object({  }),
                                                        role: Object({  }),
                                                        social_media: Object({  }),
                                                        interviewer_believes: Object({  }),
                                                        pv_believes: Object({  })
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
