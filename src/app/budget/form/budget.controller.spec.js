import Constants from './constants.js';
import BudgetService from './budget.service';
import BudgetController from './budget.controller';

describe('BudgetController', () => {
    let vm;
    let state,
        stateParams = { borderStationId: 123, id: 1 },
        budgetService;

    beforeEach(inject(($http) => {
        // let $http;
        budgetService = new BudgetService($http);
        vm = new BudgetController(state, stateParams, budgetService);
    }));

    describe('function constructor', () => {
        it(`sections should be equal to "placeholder"`, () => {
            pending("Not finished. Just holding the sections test place.");
        });

        it(`active should be equal to null`, () => {
            expect(vm.active).toEqual(null);
        });

        it(`borderMonitoringStationTotal should be equal to 0`, () => {
            expect(vm.borderMonitoringStationTotal).toEqual(0);
        });

        it(`borderStationId should be equal to${stateParams.borderStationId}`, () => {
            expect(vm.borderStationId).toEqual(stateParams.borderStationId);
        });

        it(`budgetId should be equal to ${stateParams.id}`, () => {
            expect(vm.budgetId).toEqual(stateParams.id);
        });

        it(`deletedItems should be equal to '[]'`, () => {
            expect(vm.deletedItems).toEqual([]);
        });

        it(`form should be equal to "placeholder"`, () => {
            pending("Not finished. Just holding the forms test place.");
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

    });



});