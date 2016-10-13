import Constants from './constants.js';
import BudgetService from './budget.service';
import BudgetController from './budget.controller';


describe('BudgetController', () => {
    let vm;
    let state = { go: () => { } },
        stateParams = { borderStationId: 123, id: 1, isViewing: "true" },
        budgetService,
        utils;

    beforeEach(inject(($http) => {
        utils = jasmine.createSpyObj('mockUtilService', ['handleErrors', 'validId']);
        utils.validId.and.callFake(() => { return true; });
        stateParams = { borderStationId: 123, id: 1, isViewing: "true" };
        budgetService = new BudgetService($http, utils);
        vm = new BudgetController(state, stateParams, budgetService, utils);
    }));

    describe('function constructor', () => {
        it(`sections should be object`, () => {
            let budgetFormPath = 'app/budget/form/components/';
            let sections = {
                allSections: [{ name: 'Administration', templateUrl: `${budgetFormPath}administration/administrationForm.html` },
                { name: 'Awareness', templateUrl: `${budgetFormPath}awareness/awarenessForm.html` },
                { name: 'Communication', templateUrl: `${budgetFormPath}communication/communicationForm.html` },
                { name: 'Food And Gas', templateUrl: `${budgetFormPath}foodAndGas/foodAndGasForm.html` },
                { name: 'Medical', templateUrl: `${budgetFormPath}medical/medicalForm.html` },
                { name: 'Miscellaneous', templateUrl: `${budgetFormPath}miscellaneous/miscellaneousForm.html` },
                { name: 'Salaries', templateUrl: `${budgetFormPath}salaries/salariesForm.html` },
                { name: 'Shelter', templateUrl: `${budgetFormPath}shelter/shelterForm.html` },
                { name: 'Supplies', templateUrl: `${budgetFormPath}supplies/suppliesForm.html` },
                { name: 'Travel', templateUrl: `${budgetFormPath}travel/travelForm.html` }]
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
                border_station: stateParams.borderStationId,
            };
            expect(vm.form).toEqual(form);
        });

        it(`should set form.border_station to ${stateParams.borderStationId}`, () => {
            expect(vm.form.border_station).toEqual(stateParams.borderStationId);
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

        it(`should have called validRoute`, () => {
            spyOn(vm, 'validRoute');
            vm.constructor(state, stateParams, budgetService, utils);
            expect(vm.validRoute).toHaveBeenCalled();
        });

        it(`should have called getBudgetForm`, () => {
            spyOn(vm, 'getBudgetForm');
            vm.constructor(state, stateParams, budgetService, utils);
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
            vm.form.administration_registration = false;
            vm.form.administration_registration_amount = 3;
        });

        it(`when administration_booth is true and administration_registration is false it should return 2`, () => {
            let result = vm.adminBoothRentalTotal();
            expect(result).toEqual(2);
        });

        it(`when administration_booth is false and administration_registration is true it should return 3 `, () => {
            vm.form.administration_booth = false;
            vm.form.administration_registration = true;
            let result = vm.adminBoothRentalTotal();
            expect(result).toEqual(3);
        });

        it(`when administration_booth is true and administration_registration is true it should return 5`, () => {
            vm.form.administration_registration = true;
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
            vm.form.administration_registration = true;
            vm.form.administration_registration_amount = 3;
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
            vm.form.awareness_sign_boards_boolean = false;
            vm.form.awareness_sign_boards = 1;
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

        it(`when awareness_sign_boards_boolean is true it should return 1`, () => {
            vm.form.awareness_sign_boards_boolean = true;
            let result = vm.awarenessTotal();
            expect(result).toEqual(1);
        });

        it(`should return 0`, () => {
            let result = vm.shelterTotal();
            expect(result).toEqual(0);
        });
    });

    describe(`function communicationManagerTotal`, () => {
        beforeEach(() => {
            vm.form.communication_chair = true;
            vm.form.communication_manager = true;
            vm.form.communication_chair_amount = 1;
            vm.form.communication_manager_amount = 1;
        });

        it(`when communication_chair is true and communication_manager is true it should return 2`, () => {
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(2);
        });

        it(`when communication_chair is false and communication_manager is true it should return 1`, () => {
            vm.form.communication_chair = false;
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(1);
        });

        it(`when communication_chair is true and communication_manager is false it should return 1`, () => {
            vm.form.communication_manager = false;
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(1);
        });

        it(`when communication_chair is false and communication_manager is false it should return 0`, () => {
            vm.form.communication_chair = false;
            vm.form.communication_manager = false;
            let result = vm.communicationManagerTotal();
            expect(result).toEqual(0);
        });
    });

    describe(`function communicationNumberOfStaffTotal`, () => {
        beforeEach(() => {
            vm.form.communication_number_of_staff_with_walkie_talkies = 2;
            vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 2;
        });

        it(`when communication_number_of_staff_with_walkie_talkies is valid and communication_number_of_staff_with_walkie_talkies_multiplier is valid it should return 4`, () => {
            let result = vm.communicationNumberOfStaffTotal();
            expect(result).toEqual(4);
        });

        it(`when communication_number_of_staff_with_walkie_talkies isn't valid and communication_number_of_staff_with_walkie_talkies_multiplier is valid it should return 4`, () => {
            vm.form.communication_number_of_staff_with_walkie_talkies = 0;
            let result = vm.communicationNumberOfStaffTotal();
            expect(result).toEqual(0);
        });

        it(`when communication_number_of_staff_with_walkie_talkies is valid and communication_number_of_staff_with_walkie_talkies_multiplier isn't valid it should return 4`, () => {
            vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 0;
            let result = vm.communicationNumberOfStaffTotal();
            expect(result).toEqual(0);
        });

        it(`when communication_number_of_staff_with_walkie_talkies isn't valid and communication_number_of_staff_with_walkie_talkies_multiplier isn't valid it should return 4`, () => {
            vm.form.communication_number_of_staff_with_walkie_talkies = 0;
            vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 0;
            let result = vm.communicationNumberOfStaffTotal();
            expect(result).toEqual(0);
        });
    });

    describe(`function communicationEachStaffTotal`, () => {
        beforeEach(() => {
            vm.form.communication_each_staff = 2;
            vm.form.communication_each_staff_multiplier = 2;
        });

        it(`when communication_each_staff is valid and communication_each_staff_multiplier is valid it should return 4`, () => {
            let result = vm.communicationEachStaffTotal();
            expect(result).toEqual(4);
        });

        it(`when communication_each_staff isn't valid and communication_each_staff_multiplier is valid it should return 0`, () => {
            vm.form.communication_each_staff = 0;
            let result = vm.communicationEachStaffTotal();
            expect(result).toEqual(0);
        });

        it(`when communication_each_staff is valid and communication_each_staff_multiplier isn't valid it should return 0`, () => {
            vm.form.communication_each_staff_multiplier = 0;
            let result = vm.communicationEachStaffTotal();
            expect(result).toEqual(0);
        });

        it(`when communication_each_staff isn't valid and communication_each_staff_multiplier isn't valid it should return 0`, () => {
            vm.form.communication_each_staff = 0;
            vm.form.communication_each_staff_multiplier = 0;
            let result = vm.communicationEachStaffTotal();
            expect(result).toEqual(0);
        });
    });

    describe(`function communicationTotal`, () => {
        beforeEach(() => {
            vm.form.communication_chair = true;
            vm.form.communication_manager = true;
            vm.form.communication_chair_amount = 1;
            vm.form.communication_manager_amount = 1;
            vm.form.communication_number_of_staff_with_walkie_talkies = 2;
            vm.form.communication_number_of_staff_with_walkie_talkies_multiplier = 2;
            vm.form.communication_each_staff = 2;
            vm.form.communication_each_staff_multiplier = 2;
            vm.form.other.Communcation = [{ cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }];
        });

        it(`should have called communicationManagerTotal`, () => {
            spyOn(vm, "communicationManagerTotal");
            vm.communicationTotal();
            expect(vm.communicationManagerTotal).toHaveBeenCalled();
        });

        it(`should have called communicationNumberOfStaffTotal`, () => {
            spyOn(vm, "communicationNumberOfStaffTotal");
            vm.communicationTotal();
            expect(vm.communicationNumberOfStaffTotal).toHaveBeenCalled();
        });

        it(`should have called communicationEachStaffTotal`, () => {
            spyOn(vm, "communicationEachStaffTotal");
            vm.communicationTotal();
            expect(vm.communicationEachStaffTotal).toHaveBeenCalled();
        });

        it(`should set borderMonitoringStation.communication to 10 `, () => {
            vm.communicationTotal();
            expect(vm.form.totals.borderMonitoringStation.communication).toEqual(10);
        });

        it(`should return 10`, () => {
            let result = vm.communicationTotal();
            expect(result).toEqual(10);
        });
    });

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
        it(`should multiply food_and_gas_limbo_girls_multiplier with food_and_gas_number_of_limbo_girls and food_and_gas_number_of_days then return 8`, () => {
            vm.form.food_and_gas_limbo_girls_multiplier = 2;
            vm.form.food_and_gas_number_of_limbo_girls = 2;
            vm.form.food_and_gas_number_of_days = 2;
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
            vm.form.food_and_gas_number_of_limbo_girls = 2;
            vm.form.food_and_gas_number_of_days = 2;
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

    describe(`function medicalTotal`, () => {
        it(`should set medical_last_months_expense to 2`, () => {
            vm.form.medical_last_months_expense = 2;
            vm.medicalTotal();
            expect(vm.form.medical_last_months_expense).toEqual(2);
        });
    });

    describe(`function miscellaneousMaximum`, () => {
        beforeEach(() => {
            vm.form.miscellaneous_number_of_intercepts_last_month = 2;
            vm.form.miscellaneous_number_of_intercepts_last_month_multiplier = 2;
        });

        it(`when miscellaneous_number_of_intercepts_last_month 2 and miscellaneous_number_of_intercepts_last_month_multiplier 2 it should return 4`, () => {
            let result = vm.miscellaneousMaximum();
            expect(result).toEqual(4);
        });

        it(`when miscellaneous_number_of_intercepts_last_month 0 and miscellaneous_number_of_intercepts_last_month_multiplier 2 it should return 0`, () => {
            vm.form.miscellaneous_number_of_intercepts_last_month = 0;
            let result = vm.miscellaneousMaximum();
            expect(result).toEqual(0);
        });

        it(`when miscellaneous_number_of_intercepts_last_month 2 and miscellaneous_number_of_intercepts_last_month_multiplier 0 it should return 0`, () => {
            vm.form.miscellaneous_number_of_intercepts_last_month_multiplier = 0;
            let result = vm.miscellaneousMaximum();
            expect(result).toEqual(0);
        });

        it(`when miscellaneous_number_of_intercepts_last_month 0 and miscellaneous_number_of_intercepts_last_month_multiplier 0 it should return 0`, () => {
            vm.form.miscellaneous_number_of_intercepts_last_month = 0;
            vm.form.miscellaneous_number_of_intercepts_last_month_multiplier = 0;
            let result = vm.miscellaneousMaximum();
            expect(result).toEqual(0);
        });
    });

    describe(`function miscellaneousTotal`, () => {
        beforeEach(() => {
            vm.form.miscellaneous_number_of_intercepts_last_month = 2;
            vm.form.miscellaneous_number_of_intercepts_last_month_multiplier = 2;
            vm.form.other.Miscellaneous = [{ cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }];
        });

        it(`should have called miscellaneousMaximum `, () => {
            spyOn(vm, 'miscellaneousMaximum');
            vm.miscellaneousTotal();
            expect(vm.miscellaneousMaximum).toHaveBeenCalled();
        });

        it(`should have called getOtherCost `, () => {
            spyOn(vm, 'getOtherCost');
            vm.miscellaneousTotal();
            expect(vm.getOtherCost).toHaveBeenCalled();
        });

        it(`should set borderMonitoringStation.miscellaneous to 9`, () => {
            vm.miscellaneousTotal();
            expect(vm.form.totals.borderMonitoringStation.miscellaneous).toEqual(9);
        });

        it(`should return 9`, () => {
            let result = vm.miscellaneousTotal();
            expect(result).toEqual(9);
        });
    });

    describe(`function salariesTotal`, () => {
        beforeEach(() => {
            vm.form.staff = [{ salaryInfo: { salary: 1 } }, { salaryInfo: { salary: 1 } }];
            vm.form.other.Salaries = [{ cost: 0 }, { cost: 0 }, { cost: 0 }, { cost: 0 }, { cost: 0 }];
        });

        it(`should iterant through a list of objects within objects add the totals and return 2`, () => {
            let result = vm.salariesTotal();
            expect(result).toEqual(2);
        });

        it(`should have called getOtherCost `, () => {
            spyOn(vm, 'getOtherCost');
            vm.setBorderMonitoringStationTotals();
            expect(vm.getOtherCost).toHaveBeenCalled();
        });

        it(`should set borderMonitoringStation.salaries to 2`, () => {
            vm.salariesTotal();
            expect(vm.form.totals.borderMonitoringStation.salaries).toEqual(2);
        });

        it(`should return 2`, () => {
            let result = vm.salariesTotal();
            expect(result).toEqual(2);
        });
    });

    describe(`function shelterUtilTotal`, () => {
        it('should add shelter_rent, shelter_water, shelter_electricity then return 6', () => {
            vm.form.shelter_rent = 1;
            vm.form.shelter_water = 2;
            vm.form.shelter_electricity = 3;
            expect(vm.shelterUtilTotal()).toEqual(6);
        });
    });

    describe(`function shelterCheckboxTotal`, () => {
        beforeEach(() => {
            vm.form.shelter_shelter_startup = true;
            vm.form.shelter_shelter_startup_amount = 2;
            vm.form.shelter_shelter_two = true;
            vm.form.shelter_shelter_two_amount = 2;
        });

        it(`when shelter_shelter_startup is true and shelter_shelter_two is true it should return 4`, () => {
            let result = vm.shelterCheckboxTotal();
            expect(result).toEqual(4);
        });

        it(`when shelter_shelter_startup is false and shelter_shelter_two is true it should return 2`, () => {
            vm.form.shelter_shelter_startup = false;
            let result = vm.shelterCheckboxTotal();
            expect(result).toEqual(2);
        });

        it(`when shelter_shelter_startup is true and shelter_shelter_two is false it should return 2`, () => {
            vm.form.shelter_shelter_two = false;
            let result = vm.shelterCheckboxTotal();
            expect(result).toEqual(2);
        });

        it(`when shelter_shelter_startup is false and shelter_shelter_two is false it should return 0`, () => {
            vm.form.shelter_shelter_startup = false;
            vm.form.shelter_shelter_two = false;
            let result = vm.shelterCheckboxTotal();
            expect(result).toEqual(0);
        });
    });

    describe(`function shelterTotal`, () => {
        beforeEach(() => {
            vm.form.shelter_rent = 2;
            vm.form.shelter_water = 2;
            vm.form.shelter_electricity = 2;
            vm.form.shelter_shelter_startup = true;
            vm.form.shelter_shelter_startup_amount = 2;
            vm.form.shelter_shelter_two = true;
            vm.form.shelter_shelter_two_amount = 2;
            vm.form.other.Shelter = [{ cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }];
        });

        it(`should have called shelterUtilTotal `, () => {
            spyOn(vm, 'shelterUtilTotal');
            vm.shelterTotal();
            expect(vm.shelterUtilTotal).toHaveBeenCalled();
        });

        it(`should have called shelterCheckboxTotal `, () => {
            spyOn(vm, 'shelterCheckboxTotal');
            vm.shelterTotal();
            expect(vm.shelterCheckboxTotal).toHaveBeenCalled();
        });

        it(`should have called getOtherCost `, () => {
            spyOn(vm, 'getOtherCost');
            vm.shelterTotal();
            expect(vm.getOtherCost).toHaveBeenCalled();
        });

        it(`should set safeHouse.shelter to 15`, () => {
            let result = vm.shelterTotal();
            expect(result).toEqual(15);
        });

        it(`should return 15`, () => {
            let result = vm.shelterTotal();
            expect(result).toEqual(15);
        });
    });

    describe(`function suppliesTotal`, () => {
        beforeEach(() => {
            vm.form.supplies_walkie_talkies_boolean = false;
            vm.form.supplies_walkie_talkies_amount = 2;
            vm.form.supplies_recorders_boolean = false;
            vm.form.supplies_recorders_amount = 2;
            vm.form.supplies_binoculars_boolean = false;
            vm.form.supplies_binoculars_amount = 2;
            vm.form.supplies_flashlights_boolean = false;
            vm.form.supplies_flashlights_amount = 2;
        });

        it(`when supplies_walkie_talkies_boolean is true it should return 2`, () => {
            vm.form.supplies_walkie_talkies_boolean = true;
            let result = vm.suppliesTotal();
            expect(result).toEqual(2);
        });

        it(`when supplies_walkie_talkies_boolean is false it should return 0`, () => {
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });

        it(`when supplies_recorders_boolean is true should return  2`, () => {
            vm.form.supplies_recorders_boolean = true;
            let result = vm.suppliesTotal();
            expect(result).toEqual(2);
        });

        it(`when supplies_recorders_boolean is false it should return 0`, () => {
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });

        it(`when supplies_binoculars_boolean is true it should return 2`, () => {
            vm.form.supplies_binoculars_boolean = true;
            let result = vm.suppliesTotal();
            expect(result).toEqual(2);
        });

        it(`when supplies_binoculars_boolean is false it should return 0`, () => {
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });

        it(`when supplies_flashlights_boolean is true it should return 2`, () => {
            vm.form.supplies_flashlights_boolean = true;
            let result = vm.suppliesTotal();
            expect(result).toEqual(2);
        });

        it(`when supplies_flashlights_boolean is false it should return 0`, () => {
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });

        it(`should have called getOtherCost `, () => {
            spyOn(vm, 'getOtherCost');
            vm.setBorderMonitoringStationTotals();
            expect(vm.getOtherCost).toHaveBeenCalled();
        });

        it(`should set other.supplies to 0`, () => {
            vm.suppliesTotal();
            expect(vm.form.totals.other.supplies).toEqual(0);
        });

        it(`should return 0`, () => {
            let result = vm.suppliesTotal();
            expect(result).toEqual(0);
        });
    });

    describe(`function travelMotorbikeOtherTotal`, () => {
        it(`should return 4 if travel_motorbike is true`, () => {
            vm.form.travel_motorbike = true;
            vm.form.travel_motorbike_amount = 2;
            vm.form.travel_plus_other = 2;
            let result = vm.travelMotorbikeOtherTotal();
            expect(result).toEqual(4);
        });

        it(`should return 2 if travel_motorbike is false`, () => {
            vm.form.travel_motorbike = false;
            vm.form.travel_motorbike_amount = 2;
            vm.form.travel_plus_other = 2;
            let result = vm.travelMotorbikeOtherTotal();
            expect(result).toEqual(2);
        });
    });

    describe(`function travelNumberOfStaffUsingBikesTotal`, () => {
        it(`should multiply travel_number_of_staff_using_bikes with travel_number_of_staff_using_bikes_multiplier and return 4`, () => {
            vm.form.travel_number_of_staff_using_bikes = 2;
            vm.form.travel_number_of_staff_using_bikes_multiplier = 2;
            let result = vm.travelNumberOfStaffUsingBikesTotal();
            expect(result).toEqual(4);
        });
    });

    describe(`function travelTotal`, () => {
        beforeEach(() => {
            vm.form.travel_chair_with_bike = false;
            vm.form.travel_chair_with_bike_amount = 2;
            vm.form.travel_manager_with_bike = false;
            vm.form.travel_manager_with_bike_amount = 2;
            vm.form.travel_number_of_staff_using_bikes = 2;
            vm.form.travel_number_of_staff_using_bikes_multiplier = 2;
            vm.form.travel_last_months_expense_for_sending_girls_home = 2;
            vm.form.travel_motorbike = false;
            vm.form.travel_motorbike_amount = 2;
            vm.form.travel_plus_other = 2;
            vm.form.other.Travel = [{ cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }, { cost: 1 }];
        });

        it(`when travel_chair_with_bike is true it should return 15`, () => {
            vm.form.travel_chair_with_bike = true;
            let result = vm.travelTotal();
            expect(result).toEqual(15);
        });

        it(`when travel_manager_with_bike is true it should return 15`, () => {
            vm.form.travel_manager_with_bike = true;
            let result = vm.travelTotal();
            expect(result).toEqual(15);
        });

        it(`when travel_number_of_staff_using_bikes is 0 and travel_number_of_staff_using_bikes_multiplier is 0 it should return 9`, () => {
            vm.form.travel_number_of_staff_using_bikes = 0;
            vm.form.travel_number_of_staff_using_bikes_multiplier = 0;
            let result = vm.travelTotal();
            expect(result).toEqual(9);
        });

        it(`when travel_last_months_expense_for_sending_girls_home is 0 it should return 11`, () => {
            vm.form.travel_last_months_expense_for_sending_girls_home = 0;
            let result = vm.travelTotal();
            expect(result).toEqual(11);
        });

        it(`when travel_motorbike true it should return 15 `, () => {
            vm.form.travel_motorbike = true;
            let result = vm.travelTotal();
            expect(result).toEqual(15);
        });

        it(`when travel_chair_with_bike is false and travel_manager_with_bike is false and travel_motorbike is false and other.Travel values are 0 it should return 8`, () => {
            vm.form.other.Travel = [{ cost: 0 }, { cost: 0 }, { cost: 0 }, { cost: 0 }, { cost: 0 }];
            let result = vm.travelTotal();
            expect(result).toEqual(8)
        });

        it(`should set borderMonitoringStation.travel to 13`, () => {
            vm.travelTotal();
            expect(vm.form.totals.borderMonitoringStation.travel).toEqual(13);
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

        it(`should have called medicalTotal`, () => {
            spyOn(vm, 'medicalTotal');
            vm.setBorderMonitoringStationTotals();
            expect(vm.medicalTotal).toHaveBeenCalled();
        });

        it(`should have called miscellaneousTotal `, () => {
            spyOn(vm, 'miscellaneousTotal');
            vm.setBorderMonitoringStationTotals();
            expect(vm.miscellaneousTotal).toHaveBeenCalled();
        });

        it(`should have called salariesTotal`, () => {
            spyOn(vm, 'salariesTotal');
            vm.setBorderMonitoringStationTotals();
            expect(vm.salariesTotal).toHaveBeenCalled();
        });

        it(`should have called salariesTotal`, () => {
            spyOn(vm, 'salariesTotal');
            vm.setBorderMonitoringStationTotals();
            expect(vm.salariesTotal).toHaveBeenCalled();
        });

    });

    describe(`function setSafeHouseTotals`, () => {
        it(`should have called foodAndGasTotal`, () => {
            spyOn(vm, 'foodAndGasTotal');
            vm.setSafeHouseTotals();
            expect(vm.foodAndGasTotal).toHaveBeenCalled();
        });

        it(`should have called shelterTotal`, () => {
            spyOn(vm, 'shelterTotal');
            vm.setSafeHouseTotals();
            expect(vm.shelterTotal).toHaveBeenCalled();
        });
    });

    describe(`function setTotals`, () => {
        it(`should have called setBorderMonitoringStationTotals`, () => {
            spyOn(vm, 'setBorderMonitoringStationTotals');
            vm.setTotals();
            expect(vm.setBorderMonitoringStationTotals).toHaveBeenCalled();
        });

        it(`should have called setSafeHouseTotals`, () => {
            spyOn(vm, 'setSafeHouseTotals');
            vm.setTotals();
            expect(vm.setSafeHouseTotals).toHaveBeenCalled();
        });

        it(`should have called awarenessTotal`, () => {
            spyOn(vm, 'awarenessTotal');
            vm.setTotals();
            expect(vm.awarenessTotal).toHaveBeenCalled();
        });

        it(`should have called suppliesTotal `, () => {
            spyOn(vm, 'suppliesTotal');
            vm.setTotals();
            expect(vm.suppliesTotal).toHaveBeenCalled();
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

        it('should call getPreviousData', () => {
            spyOn(vm, 'getPreviousData');
            vm.getAllData();
            expect(vm.getPreviousData).toHaveBeenCalled();
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

    describe(`function getBudgetForm`, () => {

        beforeEach(() => {
            let response = { data: { foo: 'bar' } };
            vm.service.getBudgetForm = () => { return { then: (f) => { f(response) } } };
            spyOn(vm, 'getAllData'); // getAllData is causing crashes that don't make sense!
        });

        it('should call service.getBudgetForm', () => {
            vm.budgetId = 1;
            spyOn(vm.service, 'getBudgetForm').and.callThrough();
            vm.getBudgetForm();
            expect(vm.service.getBudgetForm).toHaveBeenCalledWith(vm.budgetId);
        });

        it('should set form to response.data with changes', () => {
            vm.budgetId = 1;
            vm.form = null;
            let result = {
                foo: 'bar',
                totals: {
                    borderMonitoringStation: {},
                    other: {},
                    safeHouse: {},
                },
            };
            vm.getBudgetForm();
            expect(vm.form).toEqual(result);
        });

        it('should call getAllData', () => {
            vm.budgetId = 1;
            vm.getBudgetForm();
            expect(vm.getAllData).toHaveBeenCalled();
        });

        it('when budgetId not valid it should call getAllData', () => {
            vm.utils.validId = () => { return false };
            vm.getBudgetForm();
            expect(vm.getAllData).toHaveBeenCalled();
        });

        it('when budgetId not valid it should set form.month_year', () => {
            vm.utils.validId = () => { return false };
            vm.form.month_year = null;
            vm.getBudgetForm();
            expect(typeof vm.form.month_year).toEqual('string');
        });

    });

    describe(`function getOtherData`, () => {

        let key = 'Supplies';
        beforeEach(() => {
            let response = { data: 'foo' };
            vm.service.getOtherItems = () => { return { then: (f) => f(response) } };
        });

        it('should call service.getOtherItems several times', () => {
            vm.budgetId = 123;
            spyOn(vm.service, 'getOtherItems').and.callThrough();
            vm.getOtherData();
            expect(vm.service.getOtherItems).toHaveBeenCalledTimes(Object.keys(Constants.FormSections).length);
        });

        it('should set form.other.Supplies to "foo"', () => {
            vm.budgetId = 123;
            vm.form.other.Supplies = null;
            vm.getOtherData();
            expect(vm.form.other.Supplies).toEqual('foo');
        });

        it('should set form.other.Supplies to []', () => {
            vm.budgetId = 0;
            vm.getOtherData();
            expect(vm.form.other.Supplies).toEqual('foo');
        });

    });

    describe(`function getPreviousData`, () => {

        it('should call service.getPreviousData', () => {
            spyOn(vm.service, 'getPreviousData').and.callThrough();
            vm.getPreviousData();
            expect(vm.service.getPreviousData).toHaveBeenCalled();
        });

        it('should set form.previousData to response.data', () => {
            let response = { data: 123 };
            vm.service.getPreviousData = () => { return { then: (f) => { f(response) } } };
            vm.getPreviousData();
            expect(vm.form.previousData).toEqual(123);
        });

    });

    describe('function getStaff', () => {

        beforeEach(() => {
            let response = { data: { results: 123 } };
            vm.service.getStaff = () => { return { then: (f) => f(response) } };
        });

        it('should set form.staff to 123', () => {
            vm.form.staff = null;
            vm.getStaff();
            expect(vm.form.staff).toEqual(123);
        });

        it('should call getStaffSalaries', () => {
            spyOn(vm, 'getStaffSalaries');
            vm.getStaff();
            expect(vm.getStaffSalaries).toHaveBeenCalled();
        });

    });

    describe(`function getStaffSalaries`, () => {

        let response;
        beforeEach(() => {
            vm.budgetId = 123;
            vm.form.staff = [
                { salaryInfo: 1 },
                { salaryInfo: 2 },
                { salaryInfo: 3, id: 123 },
            ];
            response = { data: [{ staff_person: 123 }, { staff_person: 321 }] };
            vm.service.getStaffSalaries = () => { return { then: (f) => { f(response) } } };
        });

        it('should call service.getStaffSalaries', () => {
            spyOn(vm.service, 'getStaffSalaries').and.callThrough();
            vm.getStaffSalaries();
            expect(vm.service.getStaffSalaries).toHaveBeenCalledWith(vm.budgetId);
        });

        it('when response.data is not empty it should set staff.salaryInfo to {salary: 0}', () => {
            vm.getStaffSalaries();
            expect(vm.form.staff[2].salaryInfo).toEqual({ staff_person: 123 });
        });

        it('when response.data is empty it should set staff.salaryInfo to {salary: 0}', () => {
            response.data = [];
            vm.getStaffSalaries();
            expect(vm.form.staff[0].salaryInfo).toEqual({ salary: 0 });
        });

        it('should call setTotals', () => {
            spyOn(vm, 'setTotals');
            vm.getStaffSalaries();
            expect(vm.setTotals).toHaveBeenCalled();
        });

    });

    describe(`function updateOrCreateAll`, () => {

        beforeEach(() => {
            vm.form.staff = [];
        });

        it('should call updateOrCreateSalaries', () => {
            spyOn(vm, 'updateOrCreateSalaries');
            vm.updateOrCreateAll();
            expect(vm.updateOrCreateSalaries).toHaveBeenCalled();
        });

        it('should call updateOrCreateOtherItems', () => {
            spyOn(vm, 'updateOrCreateOtherItems');
            vm.updateOrCreateAll();
            expect(vm.updateOrCreateOtherItems).toHaveBeenCalled();
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

            it('should call window.toastr.success', () => {
                spyOn(window.toastr, 'success');
                vm.updateOrCreateForm();
                expect(window.toastr.success).toHaveBeenCalled();
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

            it('should call window.toastr.success', () => {
                spyOn(window.toastr, 'success');
                vm.updateOrCreateForm();
                expect(window.toastr.success).toHaveBeenCalled();
            });

        });

    });

    describe(`function updateOrCreateOtherItems`, () => {

        beforeEach(() => {
            vm.form.other = {
                foo: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 },
                ],
                Supplies: [{}, {},], // see contants.js
            };
            spyOn(vm.service, 'updateOtherItem');
            spyOn(vm.service, 'createOtherItem');
            vm.updateOrCreateOtherItems();
        });

        it('should call service.updateOtherItem 3 times', () => {
            expect(vm.service.updateOtherItem).toHaveBeenCalledTimes(3);
        });

        it('should call service.createOtherItem 2 times', () => {
            expect(vm.service.createOtherItem).toHaveBeenCalledTimes(2);
        });

        it('should call updateOtherItem with budgetId and {id: 2}', () => {
            expect(vm.service.updateOtherItem).toHaveBeenCalledWith(vm.budgetId, { id: 2 });
        });

        it('should call createOtherItem with budgetId and item', () => {
            let item = {
                budget_item_parent: vm.budgetId,
                form_section: Constants.FormSections['Supplies'],
            };
            expect(vm.service.createOtherItem).toHaveBeenCalledWith(vm.budgetId, item);
        });

    });

    describe(`function updateOrCreateSalaries`, () => {

        beforeEach(() => {
            vm.form.staff = [
                { salaryInfo: { id: 1 } },
                { salaryInfo: { id: 2 } },
                { salaryInfo: { id: 3 } },
                { salaryInfo: {}, id: 1 },
                { salaryInfo: {}, id: 2 },
            ];
            spyOn(vm.service, 'updateSalary');
            spyOn(vm.service, 'createSalary');
            vm.updateOrCreateSalaries();
        });

        it('should call service.updateSalary 3 times', () => {
            expect(vm.service.updateSalary).toHaveBeenCalledTimes(3);
        });

        it('should call service.createSalary 2 times', () => {
            expect(vm.service.createSalary).toHaveBeenCalledTimes(2);
        });

        it('should call service.updateSalary with budgetId and {id: 1}', () => {
            expect(vm.service.updateSalary).toHaveBeenCalledWith(vm.budgetId, { id: 1 });
        });

        it('should call service.updateSalary with budgetId and {id: 2}', () => {
            expect(vm.service.updateSalary).toHaveBeenCalledWith(vm.budgetId, { id: 2 });
        });

        it('should call service.updateSalary with budgetId and {id: 3}', () => {
            expect(vm.service.updateSalary).toHaveBeenCalledWith(vm.budgetId, { id: 3 });
        });

        it('should call service.createSalary with object', () => {
            expect(vm.service.createSalary).toHaveBeenCalledWith({ staff_person: 1, budget_calc_sheet: vm.budgetId });
        });

        it('should call service.createSalary with object', () => {
            expect(vm.service.createSalary).toHaveBeenCalledWith({ staff_person: 2, budget_calc_sheet: vm.budgetId });
        });

    });

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
