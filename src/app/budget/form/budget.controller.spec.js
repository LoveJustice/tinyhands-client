import Constants from './constants.js';
import BudgetService from './budget.service';
import BudgetController from './budget.controller';

describe('BudgetController', () => {
    let vm;
    let state,
        // stateParams = { borderStationId: 123, id: 1 },
        stateParams = { borderStationId: 123, id: 1 ,isViewing: false},
        budgetService,
        utils = { validId: (id) => {if (typeof id !== undefined && parseInt(id) >= 0) {
                                    return true;}
                                    return false;}};


    beforeEach(inject(($http) => {
        // let $http;
        budgetService = new BudgetService($http);
        vm = new BudgetController(state, stateParams, budgetService, utils);
    }));

    describe('function constructor', () => {
        // it(`budgetFormPath should be 'app/budget/form/components/'`,()=>{
        //     expect(vm.budgetFormPath).toEqual('app/budget/form/components/');
        // });
        it(`sections should be  "placeholder"`, () => {
            pending("Not finished. Just holding the sections test place.");
        });

        it(`active should be null`, () => {
            expect(vm.active).toEqual(null);
        });

        it(`borderMonitoringStationTotal should be 0`, () => {
            expect(vm.borderMonitoringStationTotal).toEqual(0);
        });

        it(`budgetId should be ${stateParams.id}`, () => {
            expect(vm.budgetId).toEqual(stateParams.id);
        });

        it(`deletedItems should be '[]'`, () => {
            expect(vm.deletedItems).toEqual([]);
        });

        it(`form should be "placeholder"`, () => {
            pending("Not finished. Just holding the forms test place.");
        });

        it(`form.border_station should be${stateParams.borderStationId}`,()=>{
           expect(vm.form.border_station).toEqual(stateParams.borderStationId); 
        });
        
        it(`isCreating should be false if budgetId is ${null} and borderStationId is ${null} `, () => {
            stateParams.id = null;
            stateParams.borderStationId = null;
            expect(vm.isCreating).toEqual(false);
            stateParams = { borderStationId: 123, id: 1 };

        });

        it(`isCreating should be false if budgetId isn't ${null} and borderStationId is ${null} `, () => {
            stateParams.id = 1;
            stateParams.borderStationId = null;
            expect(vm.isCreating).toEqual(false);
            stateParams = { borderStationId: 123, id: 1 };
        });

        it(`isCreating should be false if budgetId is ${stateParams.id} and borderStationId is ${stateParams.borderStationId}`, () => {
            stateParams.id = 1;
            stateParams.borderStationId = 123;
            expect(vm.isCreating).toEqual(false);
            stateParams = { borderStationId: 123, id: 1 };
        });

        it(`isCreating should be true if budgetId is ${null} and borderStationId is ${stateParams.borderStationId}`, () => {
            stateParams.id = null;
            stateParams.borderStationId = 123;
            expect(vm.isCreating).toEqual(false);
            stateParams = { borderStationId: 123, id: 1 };
        });

        it(`isViewing should be true`,()=>{
            
        });
        
        it


    });
});