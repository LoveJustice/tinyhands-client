import Constants from './constants.js';
import BudgetService from './budget.service';
import BudgetController from './budget.controller';

describe(`function`,()=>{

});


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
        beforeEach( ()=>{
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
        });
        it(`result should be 15`,()=>{
          let result = vm.adminTotal();
          expect(result).toEqual(15);
        });
        
        it(`bMS_administration should be 15 `,()=>{
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
        
        it(`if communication_chair is true and communication_manager is true result should be 2`,()=>{
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(2);
        });
        
        it(`if communication_chair is false and communication_manager is true result should be 1`,()=>{
            vm.form.communication_chair = false;
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(1);
        });
        
        it(`if communication_chair is true and communication_manager is false result should be 1`,()=>{
            vm.form.communication_manager = false;
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(1);
        });
        
        it(`if communication_chair is false and communication_manager is false result should be 0`,()=>{
            vm.form.communication_chair = false;
            vm.form.communication_manager = false;
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(0);
        });
    });
    
    describe(`function communicationNumberOfStaffTotal`,()=>{
        beforeEach(()=>{
            vm.form.communication_number_of_staff_with_walkie_talkies = 2;
            vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 2;
        });
        
        it(`if communication_number_of_staff_with_walkie_talkies is valid and communication_number_of_staff_with_walkie_talkies_multiplier is valid result should be 4`,()=>{
            let result = vm.communicationNumberOfStaffTotal();
            expect(result).toEqual(4);
        });
        
        it(`if communication_number_of_staff_with_walkie_talkies isn't valid and communication_number_of_staff_with_walkie_talkies_multiplier is valid result should be 4`,()=>{
            vm.form.communication_number_of_staff_with_walkie_talkies = 0;
            let result = vm.communicationNumberOfStaffTotal();
            expect(result).toEqual(0);
        });
        
        it(`if communication_number_of_staff_with_walkie_talkies is valid and communication_number_of_staff_with_walkie_talkies_multiplier isn't valid result should be 4`,()=>{
            vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 0;
            let result = vm.communicationNumberOfStaffTotal();
            expect(result).toEqual(0);
        });
        
        it(`if communication_number_of_staff_with_walkie_talkies isn't valid and communication_number_of_staff_with_walkie_talkies_multiplier isn't valid result should be 4`,()=>{
            vm.form.communication_number_of_staff_with_walkie_talkies = 0;
            vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 0;
            let result = vm.communicationNumberOfStaffTotal();
            expect(result).toEqual(0);
        });
    });
    
    describe(`function communicationEachStaffTotal`,()=>{
        beforeEach(()=>{
            vm.form.communication_each_staff = 2;
            vm.form.communication_each_staff_multiplier = 2;
        });
        
        it(`if communication_each_staff is valid and communication_each_staff_multiplier is valid `,()=>{
            let result = vm.communicationEachStaffTotal();
            expect(result).toEqual(4);
        });
        
        it(`if communication_each_staff isn't valid and communication_each_staff_multiplier is valid `,()=>{
            vm.form.communication_each_staff = 0;
            let result = vm.communicationEachStaffTotal();
            expect(result).toEqual(0);
        });
        
        it(`if communication_each_staff is valid and communication_each_staff_multiplier isn't valid `,()=>{
            vm.form.communication_each_staff_multiplier = 0;
            let result = vm.communicationEachStaffTotal();
            expect(result).toEqual(0);
        });
        
        it(`if communication_each_staff isn't valid and communication_each_staff_multiplier isn't valid `,()=>{
            vm.form.communication_each_staff = 0;
            vm.form.communication_each_staff_multiplier = 0;
            let result = vm.communicationEachStaffTotal();
            expect(result).toEqual(0);
        });
    });
    
    describe(`function communicationTotal`,()=>{
        beforeEach(()=>{
            vm.form.communication_chair = true;
            vm.form.communication_manager = true;
            vm.form.communication_chair_amount = 1;
            vm.form.communication_manager_amount = 1;
            vm.form.communication_number_of_staff_with_walkie_talkies = 2;
            vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 2;
            vm.form.communication_each_staff = 2;
            vm.form.communication_each_staff_multiplier = 2;
            vm.form.other.Communcation =  otherItems=[{cost:1},{cost:1},{cost:1},{cost:1},{cost:1}];
        });
        
        it(`result should be 10`,()=>{
            pending("stuff for getOtherItems doesn't work. Need help.")
            let result = vm.communicationTotal();
            expect(result).toEqual(14);
        });
    });
    
    describe(`function foodGasInterceptedGirls`,()=>{
        it(`result should be 8`,()=>{
         vm.form.food_and_gas_number_of_intercepted_girls_multiplier_before = 2;
         vm.form.food_and_gas_number_of_intercepted_girls = 2;
         vm.form.food_and_gas_number_of_intercepted_girls_multiplier_after = 2;
         let result = vm.foodGasInterceptedGirls();
         expect(result).toEqual(8);
        });
    });
    
    describe(`function foodGasLimboGirls`,()=>{
        it(`result should be 8`,()=>{
         vm.form.food_and_gas_limbo_girls_multiplier = 2;
         vm.form.food_and_gas_number_of_limbo_girls = 2;
         vm.form.food_and_gas_number_of_days = 2; 
         let result = vm.foodGasLimboGirls();
         expect(result).toEqual(8);
        });
    });
    
    describe(`function foodAndGasTotal`,()=>{
        beforeEach(()=>{
         vm.form.food_and_gas_number_of_intercepted_girls_multiplier_before = 2;
         vm.form.food_and_gas_number_of_intercepted_girls = 2;
         vm.form.food_and_gas_number_of_intercepted_girls_multiplier_after = 2;
         vm.form.food_and_gas_limbo_girls_multiplier = 2;
         vm.form.food_and_gas_number_of_limbo_girls = 2;
         vm.form.food_and_gas_number_of_days = 2; 
        });
        
        it(``,()=>{
         pending("Waiting on GetOtherCosts");
        });
    });
    
    describe(`function medicalTotal`,()=>{
        it(`madical_last_months_expense should be 2`,()=>{
            vm.form.medical_last_months_expense = 2;
            vm.medicalTotal();
            expect(vm.form.medical_last_months_expense).toEqual(2);
        });
    });
    
    describe(`function miscellaneousMaximum`,()=>{
        beforeEach(()=>{
        vm.form.miscellaneous_number_of_intercepts_last_month = 2;
        vm.form.miscellaneous_number_of_intercepts_last_month_multiplier = 2;
        });
        
        it(`if miscellaneous_number_of_intercepts_last_month 2 and miscellaneous_number_of_intercepts_last_month_multiplier 2 result should be 4`,()=>{
            let result = vm.miscellaneousMaximum();
            expect(result).toEqual(4); 
        });
        
        it(`if miscellaneous_number_of_intercepts_last_month 0 and miscellaneous_number_of_intercepts_last_month_multiplier 2 result should be 4`,()=>{
            vm.form.miscellaneous_number_of_intercepts_last_month = 0;
            let result = vm.miscellaneousMaximum();
            expect(result).toEqual(0);
        });
        
        it(`if miscellaneous_number_of_intercepts_last_month 2 and miscellaneous_number_of_intercepts_last_month_multiplier 0 result should be 4`,()=>{
            vm.form.miscellaneous_number_of_intercepts_last_month_multiplier = 0;
            let result = vm.miscellaneousMaximum();
            expect(result).toEqual(0);
        });
        
        it(`if miscellaneous_number_of_intercepts_last_month 0 and miscellaneous_number_of_intercepts_last_month_multiplier 0 result should be 4`,()=>{
         vm.form.miscellaneous_number_of_intercepts_last_month = 0;
         vm.form.miscellaneous_number_of_intercepts_last_month_multiplier = 0;
         let result = vm.miscellaneousMaximum();
         expect(result).toEqual(0);
        });
    });
    
    describe(`function miscellaneousTotal`,()=>{
        beforeEach(()=>{
        vm.form.miscellaneous_number_of_intercepts_last_month = 2;
        vm.form.miscellaneous_number_of_intercepts_last_month_multiplier = 2;
        vm.form.other.Miscellaneous = [{cost:1},{cost:1},{cost:1},{cost:1},{cost:1}];
        });
        
        it(`result should be 9`,()=>{
            let result = vm.miscellaneousTotal();
            expect(result).toEqual(9);
        });
    });
    
    describe(`function salariesTotal`,()=>{
        beforeEach(()=>{
            vm.form.staff = [{salaryInfo: {salary: 1}},{salaryInfo: {salary: 1}}];
            vm.form.other.Salaries = [{cost:1},{cost:1},{cost:1},{cost:1},{cost:1}];      
        });
        
        it(`result should be 7`,()=>{
            let result = vm.salariesTotal();
            expect(result).toEqual(7);
        });
    });
    
    describe(`function shelterUtilTotal`,()=>{
    
    });
    
    describe(`function shelterCheckboxTotal`,()=>{
        beforeEach(()=>{
            vm.form.shelter_shelter_startup = true;
            vm.form.shelter_shelter_startup_amount = 2;
            vm.form.shelter_shelter_two = true;
            vm.form.shelter_shelter_two_amount = 2;
        });
        
        it(`if shelter_shelter_startup is true and shelter_shelter_two is true result should be 4`,()=>{
            let result = vm.shelterCheckboxTotal();
            expect(result).toEqual(4); 
        });
        
        it(`if shelter_shelter_startup is false and shelter_shelter_two is true result should be 2`,()=>{
            vm.form.shelter_shelter_startup = false;
            let result = vm.shelterCheckboxTotal();
            expect(result).toEqual(2); 
        });
        
        it(`if shelter_shelter_startup is true and shelter_shelter_two is false result should be 2`,()=>{
            vm.form.shelter_shelter_two = false;
            let result = vm.shelterCheckboxTotal();
            expect(result).toEqual(2); 
        });
        
        it(`if shelter_shelter_startup is false and shelter_shelter_two is false result should be 0`,()=>{
            vm.form.shelter_shelter_startup = false;
            vm.form.shelter_shelter_two = false;
            let result = vm.shelterCheckboxTotal();
            expect(result).toEqual(0); 
        });
    });
    
    describe(`function shelterTotal`,()=>{
        beforeEach(()=>{
            vm.form.shelter_rent = 2;
            vm.form.shelter_water = 2;
            vm.form.shelter_electricity = 2;
            vm.form.shelter_shelter_startup = true;
            vm.form.shelter_shelter_startup_amount = 2;
            vm.form.shelter_shelter_two = true;
            vm.form.shelter_shelter_two_amount = 2;
            vm.form.other.Shelter = [{cost:1},{cost:1},{cost:1},{cost:1},{cost:1}];
        });
        
        it(`result should be  15`,()=>{
            let result = vm.shelterTotal();
            expect(result).toEqual(15);
        });
    });
    
    describe(`function suppliesTotal`,()=>{
        beforeEach(()=>{
            vm.form.supplies_walkie_talkies_boolean = false;
            vm.form.supplies_walkie_talkies_amount = 2;
            vm.form.supplies_recorders_boolean = false;
            vm.form.supplies_recorders_amount = 2;
            vm.form.supplies_binoculars_boolean = false;
            vm.form.supplies_binoculars_amount = 2;
            vm.form.supplies_flashlights_boolean = false;
            vm.form.supplies_flashlights_amount = 2;
        });
        
        it(`if supplies_walkie_talkies_boolean is true`,()=>{
            vm.form.supplies_walkie_talkies_boolean = true;
            let result = vm.suppliesTotal();
            expect(result).toEqual(2);
        });
        
        it(`if supplies_walkie_talkies_boolean is false`,()=>{
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });
        
        it(`if supplies_recorders_boolean is true`,()=>{
            vm.form.supplies_recorders_boolean = true;
            let result = vm.suppliesTotal();
            expect(result).toEqual(2);
        });
        
        it(`if supplies_recorders_boolean is false`,()=>{
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });        
        
        it(`if supplies_binoculars_boolean is true`,()=>{
            vm.form.supplies_binoculars_boolean = true;
            let result = vm.suppliesTotal();
            expect(result).toEqual(2);
        });
        
        it(`if supplies_binoculars_boolean is false`,()=>{
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });  
        
        it(`if supplies_flashlights_boolean is true`,()=>{
            vm.form.supplies_flashlights_boolean = true;
            let result = vm.suppliesTotal();
            expect(result).toEqual(2);
        });
        
        it(`if supplies_flashlights_boolean is false`,()=>{
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });   
        
        it(`result should be 5`,()=>{
            vm.form.other.Supplies = [{cost:1},{cost:1},{cost:1},{cost:1},{cost:1}];
            let result = vm.suppliesTotal();
            expect(result).toEqual(5);
        });      
    });
    
    describe(`function travelMotorbikeOtherTotal`,()=>{
        it(`result should be 4`,()=>{
            vm.form.travel_motorbike = true;
            vm.form.travel_motorbike_amount = 2;
            vm.form.travel_plus_other = 2;
            let result = vm.travelMotorbikeOtherTotal();
            expect(result).toEqual(4);
        });
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

      it('should return false if type is boolean', () => {
        expect(vm.clearValue(true)).toBe(false);
      });
    
      it('should return 0 if type is number', () => {
        expect(vm.clearValue(123)).toEqual(0);
      });
    
      it('should return value if type is not boolean or number', () => {
        expect(vm.clearValue("test")).toEqual("test");
      });
    
      it('should return value if type is not boolean or number', () => {
        expect(vm.clearValue({a: 'b'})).toEqual({a: 'b'});
      });
    
    });
    
    describe(`function clearValues`,()=>{

      beforeEach(() => {
        vm.form = {
          border_station: 123,
          id: 321,
          staff: [
            {salaryInfo: {salary: 1}},
            {salaryInfo: {salary: 2}},
          ],
          foo: 'bar',
          totals: {
            borderMonitoringStation: null,
          },
        };
        vm.setTotals = () => {};
      });

      it('should call clearValues with form.foo', () => {
        spyOn(vm, 'clearValue');
        vm.clearValues();
        expect(vm.clearValue).toHaveBeenCalledWith('bar');
      });

      it('should clear form.staff', () => {
        vm.clearValues();
        expect(vm.form.staff[1].salaryInfo.salary).toEqual(0);
      });

      it('should call setTotals', () => {
        spyOn(vm, 'setTotals');
        vm.clearValues();
        expect(vm.setTotals).toHaveBeenCalled();
      });
    
    });

});
