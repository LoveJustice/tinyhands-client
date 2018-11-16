import {BaseIrfController} from "./baseIrfController";
import {BaseModalController} from '../baseModalController.js';

/* global moment */

const IdConstants = {
	totalFlagId:144,
	Person:[],
	Address:[],
	RadioOther:[82,92],
	Date:[],
	RadioItems:{
		"82":[['Own brother', 'Own father', 'Own grandparent'], ['Own sister', 'Own mother', 'Own aunt/uncle']],
		"92":[['Hotel owner', 'Rickshaw driver', 'Taxi driver'], ['Bus driver', 'Church member', 'Other NGO'], ['Police', 'Subcomittee member']],
	},
	Interceptees: {
		BaseUrl: API_URL,
		Category:6,
		ImageQuestion:7,
		Person: [9],
		Address:[],
		Basic:[7,8,11],
		Date:[],
		RadioOther:[],
		RadioItems:{},
	},
};

class IrfTestController extends BaseIrfController {
	constructor($scope, $uibModal, constants, IrfService, $stateParams, $state) {
        'ngInject';        
        super($scope, $uibModal, constants, IrfService, $stateParams, $state, IdConstants);
       
        
    }
}

describe('IrfTestController', () => {
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
            submitIrf: (countryId, id, response) => ({
                then: () => { }
            })
        };
        let $stateParams = {id:null,stationId:1,countryId:4,isViewing:false};
        let $state = {go: () => {}};
        vm = new IrfTestController($scope, $uibModal, {}, IrfService, $stateParams, $state, IdConstants);
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
        					category_id: 6,
        					instances:[]
        				}
        			]
        	};
            
        });

        it('should call $uibModal open with appropriate options', () => {
            spyOn(vm.$uibModal, 'open').and.callThrough();

            vm.commonModal(null, true, null, BaseModalController, 'IntercepteeModalController',
        			'Template', 'Interceptees');

            expect(vm.$uibModal.open).toHaveBeenCalledWith({
                bindToController: true,
                controller: jasmine.any(Function),
                controllerAs: jasmine.any(String),
                resolve: {
                    isAdd: jasmine.any(Function),
                    card: jasmine.any(Function),
                    isViewing: jasmine.any(Function),
                    modalActions: jasmine.any(Function),
                    config: jasmine.any(Function)
                },
                size: 'lg',
                templateUrl: jasmine.any(String)
            });
        });

        it('when isAdd is true should add responses to list of cards in then', () => {
        	vm.commonModal(null, true, null, BaseModalController, 'IntercepteeModalController',
        			'Template', 'Interceptees');

            expect(vm.response.cards[0].instances.length).toEqual(1);
            expect(vm.response.cards[0].instances[0]).toEqual({
            	storage_id: null, 
            	flag_count: 0, 
            	responses: [ 
            		{
            			question_id: 9, 
            			response: {
            				gender: {  },
            				name: {  },
            				age: {  },
            				birthdate: {  },
            				address1: { id: null, name: '' },
            				address2: { id: null, name: '' },
            				phone: {  },
            				nationality: {  }
            			}
            		},
            		{
            			question_id: 7,
            			response: {value: null}
            		},
            		{
            			question_id: 8,
            			response: { value: null }
            		},
            		{
            			question_id: 11,
            			response: { value: null }
            		}
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

            expect(vm.incrementRedFlags).toHaveBeenCalledWith(21);
        });
    });

    describe('function setValuesForOtherInputs', () => {
        beforeEach(() => {
            vm.questions = {
                [82]: {
                    question_id: 82,
                    response: {
                        value: 'great uncle'
                    }
                },
                [92]: {
                    question_id: 92,
                    response: {
                        value: 'shop owner'
                    }
                },
            };
        });

        it('should set value for value for relation (question 82) in otherData', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherData.questions[82].otherValue).toEqual('great uncle');
        });

        it('should set value for other 92 in otherData', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherData.questions[92].otherValue).toEqual('shop owner');
        });
    });
});
