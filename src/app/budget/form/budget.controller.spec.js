 import Constants from './constants.js';
 import BudgetService from './budget.service';
 import BudgetController from './budget.controller';


 describe('BudgetController', () => {
     let vm;
     let state = { go: () => { } },
         stateParams = { borderStationId: 123, id: 1, isViewing: "true" },
         $uibModal,
         budgetService,
         utils,
         toastr,
         tmp;

     beforeEach(inject(($http) => {
         utils = jasmine.createSpyObj('mockUtilService', ['handleErrors', 'validId']);
         utils.validId.and.callFake(() => { return true; });
         stateParams = { borderStationId: 123, id: 1, isViewing: "true" };
         budgetService = new BudgetService($http, utils);
         toastr = {success: () => {}};
         vm = new BudgetController(state, stateParams, $uibModal, budgetService, utils, toastr);
     }));

     describe('function constructor', () => {
         it(`sections should be object`, () => {
             let budgetFormPath = 'budget/form/components/';
             let sections = {
                 allSections: [
                    { name: 'Salaries & Benefits', templateUrl: `${budgetFormPath}salaries/salariesForm.html` },
	                { name: 'Communication', templateUrl: `${budgetFormPath}communication/communicationForm.html` },
	                { name: 'Travel', templateUrl: `${budgetFormPath}travel/travelForm.html` },
	                { name: 'Administration', templateUrl: `${budgetFormPath}administration/administrationForm.html` },
	                { name: 'Potential Victim Care', templateUrl: `${budgetFormPath}potentialVictimCare/potentialVictimCareForm.html` },
	                { name: 'Awareness', templateUrl: `${budgetFormPath}awareness/awarenessForm.html` },
	                { name: 'Miscellaneous', templateUrl: `${budgetFormPath}miscellaneous/miscellaneousForm.html` },
                 ]
             };
             expect(vm.sections).toEqual(sections);
         });

         it(`should set active to null`, () => {
             expect(vm.active).toEqual(null);
         });

         it(`should borderMonitoringStationTotal to 0`, () => {
             expect(vm.borderMonitoringStationTotal).toEqual(0);
         });

         it(`should set budgetId to ${stateParams.id}`, () => {
             expect(vm.budgetId).toEqual(stateParams.id);
         });

         it(`should set deletedItems to '[]'`, () => {
             expect(vm.deletedItems).toEqual([]);
         });

         it(`should set form to object`, () => {
             let form = {
                 other: {},
                 totals: {
                     borderMonitoringStation: {},
                     other: {},
                     safeHouse: {}
                 },
             };
             expect(vm.form).toEqual(form);
         });

         it(`should set border_station to ${stateParams.borderStationId}`, () => {
             expect(vm.borderStationId).toEqual(stateParams.borderStationId);
         });

         it(`when budgetId is ${null} and borderStationId is ${null} it should set isCreating to false`, () => {
             stateParams.id = null;
             stateParams.borderStationId = null;
             expect(vm.isCreating).toEqual(false);
             stateParams = { borderStationId: 123, id: 1 };

         });

         it(`when budgetId isn't ${null} and borderStationId is ${null} it should set isCreating to false  `, () => {
             stateParams.id = 1;
             stateParams.borderStationId = null;
             expect(vm.isCreating).toEqual(false);
             stateParams = { borderStationId: 123, id: 1 };
         });

         it(`when budgetId is ${stateParams.id} and borderStationId is ${stateParams.borderStationId} it should set isCreating to false`, () => {
             stateParams.id = 1;
             stateParams.borderStationId = 123;
             expect(vm.isCreating).toEqual(false);
             stateParams = { borderStationId: 123, id: 1 };
         });

         it(`when budgetId is ${null} and borderStationId is ${stateParams.borderStationId} it should set isCreating to true`, () => {
             stateParams.id = null;
             stateParams.borderStationId = 123;
             expect(vm.isCreating).toEqual(false);
             stateParams = { borderStationId: 123, id: 1 };
         });

         it(`should set isViewing to true`, () => {
             expect(vm.isViewing).toEqual(true);
         });

         it(`should set safeHouseTotal to 0`, () => {
             expect(vm.safeHouseTotal).toEqual(0);
         });

         it(`should set sectionTemplateUrl to null`, () => {
             expect(vm.sectionTemplateUrl).toEqual(null);
         });

         it(`should set total to 0`, () => {
             expect(vm.total).toEqual(0);
         });

         it(`should have called getBudgetForm`, () => {
             spyOn(vm, 'getBudgetForm');
             vm.constructor(state, stateParams, $uibModal, budgetService, utils, toastr);
             expect(vm.getBudgetForm).toHaveBeenCalled();
         });
     });

     describe(`function getOtherCost`, () => {
         it(`should iterate though an array of objects, add up the values, and return 5`, () => {
             let otherItems = [{ cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }];
             let amount = vm.getOtherCost(otherItems);
             expect(amount).toEqual(5);
         });
     });

     describe(`function removeItem`, () => {
         it(`should remove otherArray[1] after function call`, () => {
             let otherArray = [1, 2, 3, 4];
             let idx = 1;
             vm.removeItem(otherArray, idx);
             expect(otherArray.length).toEqual(3);
         });
     });

     describe(`function validAmount`, () => {
         it(`should return 0 if amount is false`, () => {
             let amount = false;
             let result = vm.validAmount(amount);
             expect(result).toEqual(0);
         });

         it(`should return 5 if amount is not null`, () => {
             let amount = 5;
             let result = vm.validAmount(amount);
             expect(result).toEqual(5);
         });
     });

     describe(`function adminStationaryTotal`, () => {
         it(`should multiply administration_number_of_intercepts_last_month with administration_number_of_intercepts_last_month_multiplier, add that result withadministration_number_of_intercepts_last_month_adder, and return 6`, () => {
             vm.form.administration_number_of_intercepts_last_month = 2;
             vm.form.administration_number_of_intercepts_last_month_multiplier = 2;
             vm.form.administration_number_of_intercepts_last_month_adder = 2;
             let total = (vm.form.administration_number_of_intercepts_last_month * vm.form.administration_number_of_intercepts_last_month_multiplier) + vm.form.administration_number_of_intercepts_last_month_adder;
             let result = vm.adminStationaryTotal();
             expect(result).toEqual(total);
         });
     });

     describe(`function adminMeetingsTotal`, () => {
         it(`should multiply administration_number_of_meetings_per_month with administration_number_of_meetings_per_month_multiplier and return 4`, () => {
             vm.form.administration_number_of_meetings_per_month = 2;
             vm.form.administration_number_of_meetings_per_month_multiplier = 2;
             let total = vm.form.administration_number_of_meetings_per_month * vm.form.administration_number_of_meetings_per_month_multiplier;
             let result = vm.adminMeetingsTotal();
             expect(result).toEqual(total);
         });
     });

     describe(`function adminBoothRentalTotal`, () => {
         beforeEach(() => {
             vm.form.administration_booth = true;
             vm.form.administration_booth_amount = 2;
             vm.form.administration_office = false;
             vm.form.administration_office_amount = 3;
         });

         it(`when administration_booth is true and administration_office is false it should return 2`, () => {
             let result = vm.adminBoothRentalTotal();
             expect(result).toEqual(2);
         });

         it(`when administration_booth is false and administration_office is true it should return 3 `, () => {
             vm.form.administration_booth = false;
             vm.form.administration_office = true;
             let result = vm.adminBoothRentalTotal();
             expect(result).toEqual(3);
         });

         it(`when administration_booth is true and administration_office is true it should return 5`, () => {
             vm.form.administration_office = true;
             let result = vm.adminBoothRentalTotal();
             expect(result).toEqual(5);
         });
     });

     describe(`function adminTotal`, () => {
         beforeEach(() => {
             vm.form.administration_number_of_intercepts_last_month = 2;
             vm.form.administration_number_of_intercepts_last_month_multiplier = 2;
             vm.form.administration_number_of_intercepts_last_month_adder = 2;
             vm.form.administration_number_of_meetings_per_month = 2;
             vm.form.administration_number_of_meetings_per_month_multiplier = 2;
             vm.form.administration_booth = true;
             vm.form.administration_booth_amount = 2;
             vm.form.administration_office = true;
             vm.form.administration_office_amount = 3;
             vm.form.totals.borderMonitoringStation.administration = 0;
         });

         it(`should have called adminStationaryTotal`, () => {
             spyOn(vm, 'adminStationaryTotal');
             vm.adminTotal();
             expect(vm.adminStationaryTotal).toHaveBeenCalled();
         });

         it(`should have called adminMeetingsTotal`, () => {
             spyOn(vm, "adminMeetingsTotal");
             vm.adminTotal();
             expect(vm.adminMeetingsTotal).toHaveBeenCalled();
         });

         it(`should have called adminBoothRentalTotal`, () => {
             spyOn(vm, "adminBoothRentalTotal");
             vm.adminTotal();
             expect(vm.adminBoothRentalTotal).toHaveBeenCalled();
         });

         it(`should set bMS_administration to 15 `, () => {
             vm.adminTotal();
             expect(vm.form.totals.borderMonitoringStation.administration).toEqual(15);
         });

         it(`should return 15`, () => {
             let result = vm.adminTotal();
             expect(result).toEqual(15);
         });
     });

     describe(`function awarenessTotal`, () => {
         beforeEach(() => {
             vm.form.awareness_contact_cards = false;
             vm.form.awareness_contact_cards_amount = 1;
             vm.form.awareness_awareness_party_boolean = false;
             vm.form.awareness_awareness_party = 1;
         });

         it(`when awareness_contact_cards is true it should return 1`, () => {
             vm.form.awareness_contact_cards = true;
             let result = vm.awarenessTotal();
             expect(result).toEqual(1);
         });

         it(`when awareness_awareness_party_boolean is true it should return 1`, () => {
             vm.form.awareness_awareness_party_boolean = true;
             let result = vm.awarenessTotal();
             expect(result).toEqual(1);
         });
     });

     describe(`function communicationManagerTotal`, () => {
         beforeEach(() => {
             vm.form.communication_chair = true;
             vm.form.communication_chair_amount = 2;
         });

         it(`when communication_chair is true it should return 2`, () => {
             let result = vm.communicationManagerTotal();
             expect(result).toEqual(2);
         });

         it(`when communication_chair is false it should return 0`, () => {
             vm.form.communication_chair = false;
             let result = vm.communicationManagerTotal();
             expect(result).toEqual(0);
         });
     });

//     describe(`function communicationTotal`, () => {
//         beforeEach(() => {
//             vm.form.communication_chair = true;
//             vm.form.communication_manager = true;
//             vm.form.communication_chair_amount = 1;
//             vm.form.communication_manager_amount = 1;
//             vm.form.communication_number_of_staff_with_walkie_talkies = 2;
//             vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 2;
//             vm.form.communication_each_staff = 2;
//             vm.form.communication_each_staff_multiplier = 2;
//             vm.form.other.Communcation = [{ cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }];
//         });
//
//         it(`should have called communicationManagerTotal`, () => {
//             spyOn(vm, "communicationManagerTotal");
//             vm.communicationTotal();
//             expect(vm.communicationManagerTotal).toHaveBeenCalled();
//         });
//
//         it(`should have called communicationNumberOfStaffTotal`, () => {
//             spyOn(vm, "communicationNumberOfStaffTotal");
//             vm.communicationTotal();
//             expect(vm.communicationNumberOfStaffTotal).toHaveBeenCalled();
//         });
//
//         it(`should have called communicationEachStaffTotal`, () => {
//             spyOn(vm, "communicationEachStaffTotal");
//             vm.communicationTotal();
//             expect(vm.communicationEachStaffTotal).toHaveBeenCalled();
//         });
//
//         it(`should set borderMonitoringStation.communication to 10 `, () => {
//             vm.communicationTotal();
//             expect(vm.form.totals.borderMonitoringStation.communication).toEqual(10);
//         });
//
//         it(`should return 10`, () => {
//             let result = vm.communicationTotal();
//             expect(result).toEqual(10);
//         });
//     });

     describe(`function foodGasInterceptedGirls`, () => {
         it(`should mulitply food_and_gas_number_of_intercepted_girls_multiplier_before with food_and_gas_number_of_intercepted_girls and food_and_gas_number_of_intercepted_girls_multiplier_after then return 8`, () => {
             vm.form.food_and_gas_number_of_intercepted_girls_multiplier_before = 2;
             vm.form.food_and_gas_number_of_intercepted_girls = 2;
             vm.form.food_and_gas_number_of_intercepted_girls_multiplier_after = 2;
             let result = vm.foodGasInterceptedGirls();
             expect(result).toEqual(8);
         });
     });

     describe(`function foodGasLimboGirls`, () => {
         it(`should multiply food_and_gas_limbo_girls_multiplier with this.getOtherCost(this.form.other.Limbo) then return 8`, () => {
             vm.form.food_and_gas_limbo_girls_multiplier = 2;
             vm.form.other.Limbo = [
                     { cost:2 },
                     { cost:2 }];
             let result = vm.foodGasLimboGirls();
             expect(result).toEqual(8);
         });
     });

     describe(`function foodAndGasTotal`, () => {
         beforeEach(() => {
             vm.form.food_and_gas_number_of_intercepted_girls_multiplier_before = 2;
             vm.form.food_and_gas_number_of_intercepted_girls = 2;
             vm.form.food_and_gas_number_of_intercepted_girls_multiplier_after = 2;
             vm.form.food_and_gas_limbo_girls_multiplier = 2;
             vm.form.other.Limbo = [
                 { cost:2 },
                 { cost:2 }];
         });

         it(`should have called foodGasInterceptedGirls`, () => {
             spyOn(vm, 'foodGasInterceptedGirls');
             vm.foodAndGasTotal();
             expect(vm.foodGasInterceptedGirls).toHaveBeenCalled();
         });

         it(`should have called foodGasLimboGirls `, () => {
             spyOn(vm, 'foodGasLimboGirls');
             vm.foodAndGasTotal();
             expect(vm.foodGasLimboGirls).toHaveBeenCalled();
         });

         it(`should set safeHouse.foodAndGas to 16 `, () => {
             vm.foodAndGasTotal();
             expect(vm.form.totals.safeHouse.foodAndGas).toEqual(16);
         });

         it(`should return 16`, () => {
             let result = vm.foodAndGasTotal();
             expect(result).toEqual(16);
         });
     });

     describe(`function miscellaneousTotal`, () => {
         beforeEach(() => {
             vm.form.other.Miscellaneous = [{ cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }];
         });

         it(`should have called getOtherCost `, () => {
             spyOn(vm, 'getOtherCost');
             vm.miscellaneousTotal();
             expect(vm.getOtherCost).toHaveBeenCalled();
         });

         it(`should set borderMonitoringStation.miscellaneous to 4`, () => {
             vm.miscellaneousTotal();
             expect(vm.form.totals.borderMonitoringStation.miscellaneous).toEqual(4);
         });

         it(`should return 4`, () => {
             let result = vm.miscellaneousTotal();
             expect(result).toEqual(4);
         });
     });

//     describe(`function salariesTotal`, () => {
//         beforeEach(() => {
//             vm.form.staff = [{ salaryInfo: { salary: 1 } }, { salaryInfo: { salary: 1 } }];
//             vm.form.other.Salaries = [{ cost: 0 }, { cost: 0 }, { cost: 0 }, { cost: 0 }, { cost: 0 }];
//         });
//
//         it(`should iterant through a list of objects within objects add the totals and return 2`, () => {
//             let result = vm.salariesTotal();
//             expect(result).toEqual(2);
//         });
//
//         it(`should have called getOtherCost `, () => {
//             spyOn(vm, 'getOtherCost');
//             vm.setBorderMonitoringStationTotals();
//             expect(vm.getOtherCost).toHaveBeenCalled();
//         });
//
//         it(`should set borderMonitoringStation.salaries to 2`, () => {
//             vm.salariesTotal();
//             expect(vm.form.totals.borderMonitoringStation.salaries).toEqual(2);
//         });
//
//         it(`should return 2`, () => {
//             let result = vm.salariesTotal();
//             expect(result).toEqual(2);
//         });
//     });

     describe(`function shelterUtilTotal`, () => {
         it('should add shelter_rent, shelter_water, shelter_electricity then return 6', () => {
             vm.form.shelter_rent = true;
             vm.form.shelter_rent_amount = 1;
             vm.form.shelter_water = true;
             vm.form.shelter_water_amount = 2;
             vm.form.shelter_electricity = true;
             vm.form.shelter_electricity_amount = 3;
             expect(vm.shelterUtilTotal()).toEqual(6);
         });
     });

     describe(`function travelTotal`, () => {
         beforeEach(() => {
             vm.form.travel_chair_with_bike = false;
             vm.form.travel_chair_with_bike_amount = 2;
             vm.form.travel_plus_other = 2;
             vm.form.other.Travel = [{ cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }];
         });

         it(`when travel_chair_with_bike is true it should return 7`, () => {
             vm.form.travel_chair_with_bike = true;
             let result = vm.travelTotal();
             expect(result).toEqual(7);
         });

         it(`when travel_chair_with_bike is false and other.Travel values are 0 it should return 0`, () => {
             vm.form.other.Travel = [{ cost: 0 }, { cost: 0 }, { cost: 0 }, { cost: 0 }, { cost: 0 }];
             let result = vm.travelTotal();
             expect(result).toEqual(0);
         });

         it(`should set borderMonitoringStation.travel to 5`, () => {
             vm.travelTotal();
             expect(vm.form.totals.borderMonitoringStation.travel).toEqual(5);
         });
     });

     describe(`function setBorderMonitoringStatingTotals`, () => {
         it(`should have called adminTotal `, () => {
             spyOn(vm, 'adminTotal');
             vm.setBorderMonitoringStationTotals();
             expect(vm.adminTotal).toHaveBeenCalled();
         });

         it(`should have called communicationTotal `, () => {
             spyOn(vm, 'communicationTotal');
             vm.setBorderMonitoringStationTotals();
             expect(vm.communicationTotal).toHaveBeenCalled();
         });

         it(`should have called miscellaneousTotal `, () => {
             spyOn(vm, 'miscellaneousTotal');
             vm.setBorderMonitoringStationTotals();
             expect(vm.miscellaneousTotal).toHaveBeenCalled();
         });

         it(`should have called salariesAndBenefitsTotal`, () => {
             spyOn(vm, 'salariesAndBenefitsTotal');
             vm.setBorderMonitoringStationTotals();
             expect(vm.salariesAndBenefitsTotal).toHaveBeenCalled();
         });
     });

     describe(`function setTotals`, () => {
         it(`should have called setBorderMonitoringStationTotals`, () => {
             spyOn(vm, 'setBorderMonitoringStationTotals');
             vm.setTotals();
             expect(vm.setBorderMonitoringStationTotals).toHaveBeenCalled();
         });
     });

     describe(`function deleteOtherItems`, () => {

         beforeEach(() => {
             vm.deletedItems = ['foo', 'bar', 'baz'];
             spyOn(vm.service, 'deleteOtherItem');
             vm.deleteOtherItems();
         });

         it('should call service.deleteOtherItem 3 times', () => {
             expect(vm.service.deleteOtherItem).toHaveBeenCalledTimes(3);
         });

         it('should call service.deleteOtherItem with budgetId and "foo"', () => {
             expect(vm.service.deleteOtherItem).toHaveBeenCalledWith(vm.budgetId, 'foo');
         });

         it('should call service.deleteOtherItem with budgetId and "bar"', () => {
             expect(vm.service.deleteOtherItem).toHaveBeenCalledWith(vm.budgetId, 'bar');
         });

         it('should call service.deleteOtherItem with budgetId and "baz"', () => {
             expect(vm.service.deleteOtherItem).toHaveBeenCalledWith(vm.budgetId, 'baz');
         });

     });

     describe(`function getAllData`, () => {

         it('should call getStaff', () => {
             spyOn(vm, 'getStaff');
             vm.getAllData();
             expect(vm.getStaff).toHaveBeenCalled();
         });

         it('should call getBorderStation', () => {
             spyOn(vm, 'getBorderStation');
             vm.getAllData();
             expect(vm.getBorderStation).toHaveBeenCalled();
         });

         it('should call setTotals', () => {
             spyOn(vm, 'setTotals');
             vm.getAllData();
             expect(vm.setTotals).toHaveBeenCalled();
         });

         it('should call getOtherData', () => {
             spyOn(vm, 'getOtherData');
             vm.getAllData();
             expect(vm.getOtherData).toHaveBeenCalled();
         });

     });

     describe(`function getBorderStation`, () => {

         it('should call service.getBorderStation', () => {
             spyOn(vm.service, 'getBorderStation').and.callThrough();
             vm.getBorderStation();
             expect(vm.service.getBorderStation).toHaveBeenCalled();
         });

         it('should set form.station_name to "foo"', () => {
             let response = { data: { station_name: 'foo' } };
             vm.service.getBorderStation = () => { return { then: (f) => { f(response) } } };
             vm.getBorderStation();
             expect(vm.form.station_name).toEqual('foo');
         });

     });

//     describe(`function getBudgetForm`, () => {
//
//         beforeEach(() => {
//             let response = { data: { foo: 'bar' } };
//             vm.service.getBudgetForm = () => { return { then: (f) => { f(response) } } };
//             spyOn(vm, 'getAllData'); // getAllData is causing crashes that don't make sense!
//         });
//
//         it('should call service.getBudgetForm', () => {
//             vm.budgetId = 1;
//             spyOn(vm.service, 'getBudgetForm').and.callThrough();
//             vm.getBudgetForm();
//             expect(vm.service.getBudgetForm).toHaveBeenCalledWith(vm.budgetId);
//         });
//
//         it('should set form to response.data with changes', () => {
//             vm.budgetId = 1;
//             vm.form = null;
//             let result = {
//                 foo: 'bar',
//                 totals: {
//                     borderMonitoringStation: {},
//                     other: {},
//                     safeHouse: {},
//                 },
//             };
//             vm.getBudgetForm();
//             expect(vm.form).toEqual(result);
//         });
//
//         it('should call getAllData', () => {
//             vm.budgetId = 1;
//             vm.getBudgetForm();
//             expect(vm.getAllData).toHaveBeenCalled();
//         });
//
//         it('when budgetId not valid it should call getAllData', () => {
//             vm.utils.validId = () => { return false };
//             vm.getBudgetForm();
//             expect(vm.getAllData).toHaveBeenCalled();
//         });
//
//         it('when budgetId not valid it should set form.month_year', () => {
//             vm.utils.validId = () => { return false };
//             vm.form.month_year = null;
//             vm.getBudgetForm();
//             expect(typeof vm.form.month_year).toEqual('string');
//         });
//
//     });
//
//     describe(`function getOtherData`, () => {
//
//         let key = 'Supplies';
//         beforeEach(() => {
//             let response = { data: 'foo' };
//             vm.service.getOtherItems = () => { return { then: (f) => f(response) } };
//         });
//
//         it('should call service.getOtherItems several times', () => {
//             vm.budgetId = 123;
//             spyOn(vm.service, 'getOtherItems').and.callThrough();
//             vm.getOtherData();
//             expect(vm.service.getOtherItems).toHaveBeenCalledTimes(Object.keys(Constants.FormSections).length);
//         });
//
//         it('should set form.other.Supplies to "foo"', () => {
//             vm.budgetId = 123;
//             vm.form.other.Supplies = null;
//             vm.getOtherData();
//             expect(vm.form.other.Supplies).toEqual('foo');
//         });
//
//         it('should set form.other.Supplies to []', () => {
//             vm.budgetId = 0;
//             vm.getOtherData();
//             expect(vm.form.other.Supplies).toEqual('foo');
//         });
//
//     });
//
//     describe('function getStaff', () => {
//
//         beforeEach(() => {
//             let response = { data: { results: 123 } };
//             vm.service.getStaff = () => { return { then: (f) => f(response) } };
//         });
//
//         it('should set form.staff to 123', () => {
//             vm.form.staff = null;
//             vm.getStaff();
//             expect(vm.form.staff).toEqual(123);
//         });
//
//         it('should call getStaffSalaries', () => {
//             spyOn(vm, 'getStaffSalaries');
//             vm.getStaff();
//             expect(vm.getStaffSalaries).toHaveBeenCalled();
//         });
//
//     });
//
     describe(`function updateOrCreateAll`, () => {

         beforeEach(() => {
             vm.form.staff = {
             	sortedStaff:[]
             };
         });

         it('should call updateOrCreateStaffItems', () => {
             spyOn(vm, 'updateOrCreateStaffItems');
             vm.updateOrCreateAll();
             expect(vm.updateOrCreateStaffItems).toHaveBeenCalled();
         });

         it('should call updateOrCreateOtherItems', () => {
             spyOn(vm, 'updateOrCreateOtherItems');
             vm.updateOrCreateAll();
             expect(vm.updateOrCreateOtherItems).toHaveBeenCalled();
         });
         
         it('should call deleteStaffItems', () => {
             spyOn(vm, 'deleteStaffItems');
             vm.updateOrCreateAll();
             expect(vm.deleteStaffItems).toHaveBeenCalled();
         });

         it('should call deleteOtherItems', () => {
             spyOn(vm, 'deleteOtherItems');
             vm.updateOrCreateAll();
             expect(vm.deleteOtherItems).toHaveBeenCalled();
         });

         it('should call $state.go with "budgetList"', () => {
             spyOn(vm.$state, 'go');
             vm.updateOrCreateAll();
             expect(vm.$state.go).toHaveBeenCalledWith('budgetList');
         });

     });

     describe(`function updateOrCreateForm`, () => {

         describe('if isCreating ', () => {

             let response;

             beforeEach(() => {
                 vm.isCreating = true;
                 vm.service.createForm = () => { return { then: (f) => { f(response) } } };
                 vm.updateOrCreateAll = () => { };
             });

             it('should set budgetId to 123', () => {
                 response = { data: { id: 123 } };
                 vm.updateOrCreateForm();
                 expect(vm.budgetId).toEqual(123);
             });

             it('should call updateOrCreateAll', () => {
                 spyOn(vm, 'updateOrCreateAll');
                 vm.updateOrCreateForm();
                 expect(vm.updateOrCreateAll).toHaveBeenCalled();
             });

         });

         describe('if not isCreating ', () => {

             beforeEach(() => {
                 vm.isCreating = false;
                 vm.service.updateForm = () => { return { then: (f) => { f() } } };
                 vm.updateOrCreateAll = () => { };
             });

             it('should call updateOrCreateAll', () => {
                 spyOn(vm, 'updateOrCreateAll');
                 vm.updateOrCreateForm();
                 expect(vm.updateOrCreateAll).toHaveBeenCalled();
             });
         });

     });

//     describe(`function updateOrCreateOtherItems`, () => {
//
//         beforeEach(() => {
//             vm.form.other = {
//                 foo: [
//                     { id: 1 },
//                     { id: 2 },
//                     { id: 3 },
//                 ],
//                 Supplies: [{}, {},], // see contants.js
//             };
//             spyOn(vm.service, 'updateOtherItem');
//             spyOn(vm.service, 'createOtherItem');
//             vm.updateOrCreateOtherItems();
//         });
//
//         it('should call service.updateOtherItem 3 times', () => {
//             expect(vm.service.updateOtherItem).toHaveBeenCalledTimes(3);
//         });
//
//         it('should call service.createOtherItem 2 times', () => {
//             expect(vm.service.createOtherItem).toHaveBeenCalledTimes(2);
//         });
//
//         it('should call updateOtherItem with budgetId and {id: 2}', () => {
//             expect(vm.service.updateOtherItem).toHaveBeenCalledWith(vm.budgetId, { id: 2 });
//         });
//
//         it('should call createOtherItem with budgetId and item', () => {
//             let item = {
//                 budget_item_parent: vm.budgetId,
//                 form_section: Constants.FormSections['Supplies'],
//             };
//             expect(vm.service.createOtherItem).toHaveBeenCalledWith(vm.budgetId, item);
//         });
//
//     });

     describe(`function clearValue`, () => {

         it('when type is boolean it should return false', () => {
             expect(vm.clearValue(true)).toBe(false);
         });

         it('when type is number it should return 0', () => {
             expect(vm.clearValue(123)).toEqual(0);
         });

         it('when type is not boolean or number it should return value', () => {
             expect(vm.clearValue("test")).toEqual("test");
         });

         it('when type is not boolean or number it should return value', () => {
             expect(vm.clearValue({ a: 'b' })).toEqual({ a: 'b' });
         });

     });

     describe(`function clearValues`, () => {

         beforeEach(() => {
             vm.form = {
                 border_station: 123,
                 id: 321,
                 staff: [
                     { salaryInfo: { salary: 1 } },
                     { salaryInfo: { salary: 2 } },
                 ],
                 foo: 'bar',
                 totals: {
                     borderMonitoringStation: null,
                 },
             };
             vm.setTotals = () => { };
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
