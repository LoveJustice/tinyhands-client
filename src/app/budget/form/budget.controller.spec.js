import Constants from './constants.js';
import BudgetService from './budget.service';
import BudgetController from './budget.controller';

describe('BudgetController', () => {
    let vm;
    let state,
        // stateParams = { borderStationId: 123, id: 1 },
        stateParams = { borderStationId: 123, id: 1 ,isViewing: "true"},
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
            pending("Not sure about this test, need to ask question")
            expect(vm.isViewing).toEqual(stateParams.isViewing);
        });
        
        it(`safeHouseTotal should be 0`,()=>{
         expect(vm.safeHouseTotal).toEqual(0);
        });
        
        it(`sectionTemplateUrl should be null`,()=>{
         expect(vm.sectionTemplateUrl).toEqual(null);
        });
        
        it(`total should be 0`,()=>{
         expect(vm.total).toEqual(0);
        });

        it(`validRoute should have been called`,()=>{
         pending("Not sure about this test, need to ask question")
         spyOn(vm,"constructor().validRoute()");
         vm.constructor();
         expect(vm.validRoute).toHaveBeenCalled();
        });

        it(`getBudgetForm should have been called`,()=>{
         pending("Not sure about this test, need to ask question")
         spyOn(vm,"constructor().getBudgetForm");
         vm.constructor();
         expect(vm.getBudgetForm).toHaveBeenCalled();
        });
    });
    
    describe(`function getOtherCost`,()=>{
        it(`dsafasdfads`,()=>{
            pending("not done yet")
           spyOn(vm,"validAmount");
           expect(vm.validAmount).toHaveBeenCalled();
        });
    });
    
    describe(`function removeItem`,()=>{
     
    });
    
    describe(`function validAmount`,()=>{
     
    });
    
    describe(`function adminStationaryTotal`,()=>{
    
    });
    
    describe(`function adminMeetingsTotal`,()=>{
    
    });
    
    describe(`function adminBoothRentalTotal`,()=>{
    
    });
    
    describe(`function adminTotal`,()=>{
    
    });
    
    describe(`function awarenessTotal`,()=>{
    
    });
    
    describe(`function communicationManagerTotal`,()=>{
    
    });
    
    describe(`function communicationEachStaffTotal`,()=>{
    
    });
    
    describe(`function communicationTotal`,()=>{
    
    });
    
    describe(`function foodGasInterceptedGirls`,()=>{
    
    });
    
    describe(`function foodGasLimboGirls`,()=>{
    
    });
    
    describe(`function foodAndGasTotal`,()=>{
    
    });
    
    describe(`function medicalTotal`,()=>{
    
    });
    
    describe(`function miscellaneousMaximum`,()=>{
    
    });
    
    describe(`function miscellaneousTotal`,()=>{
    
    });
    
    describe(`function salariesTotal`,()=>{
    
    });
    
    describe(`function shelterCheckboxTotal`,()=>{
    
    });
    
    describe(`function shelterTotal`,()=>{
    
    });
    
    describe(`function suppliesTotal`,()=>{
    
    });
    
    describe(`function travelMotorbikeOtherTotal`,()=>{
    
    });
    
    describe(`function travelNumberOfStaffUsingBikesTotal`,()=>{
    
    });
    
    describe(`function travelTotal`,()=>{
    
    });
    
    describe(`function setBorderMonitoringStatingTotals`,()=>{
    
    });
    
    describe(`function setSafeHouseTotals`,()=>{
    
    });
    
    describe(`function setTotals`,()=>{
    
    });
    
    describe(`function deleteOtherItems`,()=>{
    
    });
    
    describe(`function getAllData`,()=>{
    
    });
    
    describe(`function getBorderStation`,()=>{
    
    });
    
    describe(`function getBudgetForm`,()=>{
    
    });
    
    describe(`function getOtherData`,()=>{
    
    });
    
    describe(`function getPreviousData`,()=>{
    
    });
    
    describe(`function getStaffSalaries`,()=>{
    
    });
    
    describe(`function updateOrCreateAll`,()=>{
    
    });
    
    describe(`function updateOrCreateForm`,()=>{
    
    });
    
    describe(`function updateOrCreateOtherItems`,()=>{
    
    });
    
    describe(`function updateOrCreateSalaries`,()=>{
    
    });
    
    describe(`function clearValue`,()=>{
    
    });
    
    describe(`function clearValues`,()=>{
    
    });
});
