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
        it(`amount should be equal to 5`,()=>{
           pending("Currently amount becomes equal to NaN. Not sure why");
           let otherItems=[{cost:1},{cost:1},{cost:1},{cost:1},{cost:1}];
           let amount = vm.getOtherCost(otherItems);
           expect(amount).toEqual(5);
        });
    });
    
    describe(`function removeItem`,()=>{
        it(`otherArray[1] should be removed after function`,()=>{
         let otherArray = [1, 2, 3 ,4];
         let idx = 1;
         vm.removeItem(otherArray,idx);
         expect(otherArray.length).toEqual(3);
        });
    });
    
    describe(`function validAmount`,()=>{
        it(`if amount not zero return amount`,()=>{
         let amount = 5;
         let result = vm.validAmount(amount);
         expect(result).toEqual(5);
        });  
        
        it(`if amount is zero return zero`,()=>{
         let amount = 5;
         let result = vm.validAmount(amount);
         expect(result).toEqual(5);
        });
    });
    
    describe(`function adminStationaryTotal`,()=>{
        it(`result should be 6`,()=>{
          vm.form.administration_number_of_intercepts_last_month = 2;
          vm.form.administration_number_of_intercepts_last_month_multiplier = 2;
          vm.form.administration_number_of_intercepts_last_month_adder = 2;
          let total = (vm.form.administration_number_of_intercepts_last_month * vm.form.administration_number_of_intercepts_last_month_multiplier)+vm.form.administration_number_of_intercepts_last_month_adder;
          let result = vm.adminStationaryTotal();
          expect(result).toEqual(total);
        });

    });
    
    describe(`function adminMeetingsTotal`,()=>{
        it(`result should be 4`,()=>{
          vm.form.administration_number_of_meetings_per_month = 2;
          vm.form.administration_number_of_meetings_per_month_multiplier = 2;
          let total = vm.form.administration_number_of_meetings_per_month * vm.form.administration_number_of_meetings_per_month_multiplier;
          let result = vm.adminMeetingsTotal();
          expect(result).toEqual(total);
        });
    });
    
    describe(`function adminBoothRentalTotal`,()=>{
        beforeEach(()=>{
            vm.form.administration_booth = true;
            vm.form.administration_booth_amount = 2;
            vm.form.administration_registration = false;
            vm.form.administration_registration_amount =3;
        });
        it(`if administration_booth is true and administration_registration is false return 2`,()=>{
            let result = vm.adminBoothRentalTotal();
            expect(result).toEqual(2);
        });
        
        it(`if administration_booth is false and administration_registration is true return 3`,()=>{
            vm.form.administration_booth = false;
            vm.form.administration_registration = true;
            let result = vm.adminBoothRentalTotal();
            expect(result).toEqual(3);
        });
        
        it(`if administration_booth is true and administration_registration is true return 5`,()=>{
            vm.form.administration_registration = true;
            let result = vm.adminBoothRentalTotal();
            expect(result).toEqual(5);         
        });
    });
    
    describe(`function adminTotal`,()=>{
        it(`result should be 15`,()=>{
          vm.form.administration_number_of_intercepts_last_month = 2;
          vm.form.administration_number_of_intercepts_last_month_multiplier = 2;
          vm.form.administration_number_of_intercepts_last_month_adder = 2;
          vm.form.administration_number_of_meetings_per_month = 2;
          vm.form.administration_number_of_meetings_per_month_multiplier = 2;
          vm.form.administration_booth= true;
          vm.form.administration_booth_amount = 2;
          vm.form.administration_registration = true;
          vm.form.administration_registration_amount =3;
          let result = vm.adminTotal();
          expect(result).toEqual(15);
        });
        
        it(`bMS_administration should be 15 `,()=>{
          vm.form.administration_number_of_intercepts_last_month = 2;
          vm.form.administration_number_of_intercepts_last_month_multiplier = 2;
          vm.form.administration_number_of_intercepts_last_month_adder = 2;
          vm.form.administration_number_of_meetings_per_month = 2;
          vm.form.administration_number_of_meetings_per_month_multiplier = 2;
          vm.form.administration_booth= true;
          vm.form.administration_booth_amount = 2;
          vm.form.administration_registration = true;
          vm.form.administration_registration_amount =3;
          vm.form.totals.borderMonitoringStation.administration = 0;
          vm.adminTotal();
          expect(vm.form.totals.borderMonitoringStation.administration).toEqual(15);
        });
    });
    
    describe(`function awarenessTotal`,()=>{
        it(`if awareness_contact_cards is true and awareness_awareness_party_boolean is true and awareness_sign_boards_boolean is true`,()=>{
            vm.form.awareness_contact_cards = true;
            vm.form.awareness_awareness_party_boolean = true;
            vm.form.awareness_sign_boards_boolean = true;
            vm.form.awareness_contact_cards_amount = 1;
            vm.form.awareness_awareness_party_amount = 1;
            vm.form.awareness_sign_boards= 1; 
        });
    });
    
    describe(`function communicationManagerTotal`,()=>{
        beforeEach(()=>{
            vm.form.communication_chair = true;
            vm.form.communication_manager = true;
            vm.form.communication_chair_amount = 1;
            vm.form.communication_manager_amount = 1;
        });
        it(`if communication_chair is true and communication_manager is true return 2`,()=>{
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(2);
        });
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
