import Constants from './constants.js';

export default class BudgetController {
    constructor($state, $stateParams, BudgetService, UtilService) {
        'ngInject';

        this.$state = $state;
        this.service = BudgetService;
        this.utils = UtilService;


        // Variable Declarations
        let budgetFormPath = 'app/budget/form/components/';
        this.sections = {
            allSections: [
                { name: 'Salaries', templateUrl: `${budgetFormPath}salaries/salariesForm.html` },
                { name: 'Communication', templateUrl: `${budgetFormPath}communication/communicationForm.html` },
                { name: 'Travel', templateUrl: `${budgetFormPath}travel/travelForm.html` },
                { name: 'Administration', templateUrl: `${budgetFormPath}administration/administrationForm.html` },
                { name: 'Medical', templateUrl: `${budgetFormPath}medical/medicalForm.html` },
                { name: 'Miscellaneous', templateUrl: `${budgetFormPath}miscellaneous/miscellaneousForm.html` },
                { name: 'Shelter', templateUrl: `${budgetFormPath}shelter/shelterForm.html` },
                { name: 'Food And Gas', templateUrl: `${budgetFormPath}foodAndGas/foodAndGasForm.html` },
                { name: 'Awareness', templateUrl: `${budgetFormPath}awareness/awarenessForm.html` },
                { name: 'Supplies', templateUrl: `${budgetFormPath}supplies/suppliesForm.html` },
            ]
        };
        this.active = null;
        this.borderMonitoringStationTotal = 0;
        this.budgetId = $stateParams.id;
        this.deletedItems = [];
        this.form = {
            other: {},
            totals: {
                borderMonitoringStation: {},
                other: {},
                safeHouse: {}
            }
        };
        this.form.border_station = $stateParams.borderStationId;
        this.isCreating = !this.budgetId && this.form.border_station;
        this.isViewing = $stateParams.isViewing === "true";
        this.safeHouseTotal = 0;
        this.sectionTemplateUrl = null;
        this.total = 0;

        this.validRoute();
        this.getBudgetForm();
    }


    // Functions

    getOtherCost(otherItems) {
        let amount = 0;
        for (let i in otherItems) {
            amount += this.validAmount(otherItems[i].cost);
        }
        return amount;
    }

    removeItem(otherArray, idx) {
        let item = otherArray[idx];
        if (item.id) {
            this.deletedItems.push(item);
        }
        otherArray.splice(idx, 1);
    }

    validAmount(amount) {
        if (amount) {
            return amount;
        }
        return 0;
    }

    validRoute() {
        if (!this.budgetId && !this.isCreating && !this.isViewing) {
            this.$state.go('budgetList');
        }
    }


    // REGION: Administration
    adminStationaryTotal() {
        return this.validAmount(this.form.administration_number_of_intercepts_last_month * this.form.administration_number_of_intercepts_last_month_multiplier) + this.validAmount(this.form.administration_number_of_intercepts_last_month_adder);
    }

    adminMeetingsTotal() {
        return this.validAmount(this.form.administration_number_of_meetings_per_month * this.form.administration_number_of_meetings_per_month_multiplier);
    }

    adminBoothRentalTotal() {
        var amount = 0;
        if (this.form.administration_booth) {
            amount += this.validAmount(this.form.administration_booth_amount);
        }
        if (this.form.administration_registration) {
            amount += this.validAmount(this.form.administration_registration_amount);
        }
        return amount;
    }

    adminTotal() {
        let amount = this.adminStationaryTotal() + this.adminMeetingsTotal() + this.adminBoothRentalTotal() + this.getOtherCost(this.form.other.Administration);
        this.form.totals.borderMonitoringStation.administration = amount;
        return amount;
    }
    // ENDREGION: Administration


    // REGION: Awareness
    awarenessTotal() {
        var amount = 0;
        if (this.form.awareness_contact_cards) {
            amount += this.validAmount(this.form.awareness_contact_cards_amount);
        }
        if (this.form.awareness_awareness_party_boolean) {
            amount += this.validAmount(this.form.awareness_awareness_party);
        }
        if (this.form.awareness_sign_boards_boolean) {
            amount += this.validAmount(this.form.awareness_sign_boards);
        }
        amount += this.getOtherCost(this.form.other.Awareness);
        this.form.totals.other.awareness = amount;
        return amount;
    }
    // ENDREGION: Awareness


    // REGION: Communication
    communicationManagerTotal() {
        var amount = 0;

        if (this.form.communication_chair) {
            amount += this.validAmount(this.form.communication_chair_amount);
        }
        if (this.form.communication_manager) {
            amount += this.validAmount(this.form.communication_manager_amount);
        }
        return amount;
    }

    communicationNumberOfStaffTotal() {
        return this.validAmount(this.form.communication_number_of_staff_with_walkie_talkies *
            this.form.communication_number_of_staff_with_walkie_talkies_multiplier);
    }

    communicationEachStaffTotal() {
        return this.validAmount(this.form.communication_each_staff *
            this.form.communication_each_staff_multiplier);
    }

    communicationTotal() {
        let amount = this.communicationManagerTotal() + this.communicationNumberOfStaffTotal() + this.communicationEachStaffTotal();
        amount += this.getOtherCost(this.form.other.Communication);
        this.form.totals.borderMonitoringStation.communication = amount;
        return amount;
    }
    // ENDREGION: Communication


    // REGION: Food And Gas
    foodGasInterceptedGirls() {
        return this.validAmount(this.form.food_and_gas_number_of_intercepted_girls_multiplier_before *
            this.form.food_and_gas_number_of_intercepted_girls *
            this.form.food_and_gas_number_of_intercepted_girls_multiplier_after);
    }

    foodGasLimboGirls() {
        return this.validAmount(this.form.food_and_gas_limbo_girls_multiplier *
            this.form.food_and_gas_number_of_limbo_girls *
            this.form.food_and_gas_number_of_days);
    }

    foodAndGasTotal() {
        let amount = this.foodGasInterceptedGirls() + this.foodGasLimboGirls();
        amount += this.getOtherCost(this.form.other.FoodAndGas);
        this.form.totals.safeHouse.foodAndGas = amount;
        return amount;
    }
    // ENDREGION: Food And Gas


    // REGION: Medical
    medicalTotal() {
        let total = this.form.medical_last_months_expense + this.getOtherCost(this.form.other.Medical);
        this.form.totals.borderMonitoringStation.medical = total;
        return this.form.medical_last_months_expense + total;
    }
    // ENDREGION: Medical


    // REGION: Miscellaneous
    miscellaneousMaximum() {
        return this.validAmount(this.form.miscellaneous_number_of_intercepts_last_month * this.form.miscellaneous_number_of_intercepts_last_month_multiplier);
    }

    miscellaneousTotal() {
        let amount = this.miscellaneousMaximum() + this.getOtherCost(this.form.other.Miscellaneous);
        this.form.totals.borderMonitoringStation.miscellaneous = amount;
        return amount;
    }
    // ENDREGION: Miscellaneous


    // REGION: Salaries
    salariesTotal() {
        var amount = 0;

        for (let i in this.form.staff) {
            let staff = this.form.staff[i];
            if (staff.salaryInfo) {
                amount += staff.salaryInfo.salary;
            }
        }

        amount += this.getOtherCost(this.form.other.Salaries);

        this.form.totals.borderMonitoringStation.salaries = amount;

        return amount;
    }
    // ENDREGION: Salaries


    // REGION: Shelter
    shelterUtilTotal() {
        return this.validAmount(this.form.shelter_rent) + this.validAmount(this.form.shelter_water) + this.validAmount(this.form.shelter_electricity);
    }

    shelterCheckboxTotal() {
        var totalAmount = 0;
        if (this.form.shelter_shelter_startup) {
            totalAmount += this.validAmount(this.form.shelter_shelter_startup_amount);
        }
        if (this.form.shelter_shelter_two) {
            totalAmount += this.validAmount(this.form.shelter_shelter_two_amount);
        }
        return totalAmount;
    }

    shelterTotal() {
        var amount = 0;
        amount += this.shelterUtilTotal() + this.shelterCheckboxTotal(this.form);
        amount += this.getOtherCost(this.form.other.Shelter);
        this.form.totals.safeHouse.shelter = amount;
        return amount;
    }
    // ENDREGION: Shelter


    // REGION: Supplies
    suppliesTotal() {
        var amount = 0;
        if (this.form.supplies_walkie_talkies_boolean) {
            amount += this.validAmount(this.form.supplies_walkie_talkies_amount);
        }
        if (this.form.supplies_recorders_boolean) {
            amount += this.validAmount(this.form.supplies_recorders_amount);
        }
        if (this.form.supplies_binoculars_boolean) {
            amount += this.validAmount(this.form.supplies_binoculars_amount);
        }
        if (this.form.supplies_flashlights_boolean) {
            amount += this.validAmount(this.form.supplies_flashlights_amount);
        }
        amount += this.getOtherCost(this.form.other.Supplies);
        this.form.totals.other.supplies = amount;
        return amount;
    }
    // ENDREGION: Supplies


    // REGION: Travel
    travelMotorbikeOtherTotal() {
        var returnVal = 0;
        if (this.form.travel_motorbike) {
            returnVal = this.validAmount(this.form.travel_motorbike_amount);
        }
        returnVal += this.validAmount(this.form.travel_plus_other);
        return returnVal;
    }

    travelNumberOfStaffUsingBikesTotal() {
        return this.validAmount(this.form.travel_number_of_staff_using_bikes * this.form.travel_number_of_staff_using_bikes_multiplier);
    }

    travelTotal() {
        var amount = 0;
        if (this.form.travel_chair_with_bike) {
            amount += this.form.travel_chair_with_bike_amount;
        }
        if (this.form.travel_manager_with_bike) {
            amount += this.form.travel_manager_with_bike_amount;
        }
        amount += this.travelNumberOfStaffUsingBikesTotal() +
            this.validAmount(this.form.travel_last_months_expense_for_sending_girls_home) +
            this.travelMotorbikeOtherTotal() +
            this.getOtherCost(this.form.other.Travel);
        this.form.totals.borderMonitoringStation.travel = amount;
        return amount;
    }
    // ENDREGION: Travel



    // REGION: Functions that handle totals
    setBorderMonitoringStationTotals() {
        let amount = this.adminTotal() +
            this.communicationTotal() +
            this.medicalTotal() +
            this.miscellaneousTotal() +
            this.salariesTotal() +
            this.travelTotal();
        this.borderMonitoringStationTotal = amount;
        return amount;
    }

    setSafeHouseTotals() {
        let amount = this.foodAndGasTotal() + this.shelterTotal();
        this.safeHouseTotal = amount;
        return amount;
    }

    setTotals() {
        let amount = this.setBorderMonitoringStationTotals() +
            this.setSafeHouseTotals() +
            this.awarenessTotal() +
            this.suppliesTotal();
        this.total = amount;
    }
    // ENDREGION: Functions that handle totals



    // REGION: Call to Service Functions
    // REGION: DELETE Calls
    deleteOtherItems() {
        for (let i in this.deletedItems) {
            this.service.deleteOtherItem(this.budgetId, this.deletedItems[i]);
        }
    }
    // ENDREGION: DELETE Calls

    // REGION: GET Calls
    getAllData() {
        this.getStaff();
        this.getBorderStation();
        this.getPreviousData();
        this.getOtherData();
    }

    getBorderStation() {
        this.service.getBorderStation(this.form.border_station).then((response) => {
            this.form.station_name = response.data.station_name;
        });
    }

    getBudgetForm() {
        if (this.utils.validId(this.budgetId)) {
            this.service.getBudgetForm(this.budgetId).then((response) => {
                this.form = response.data;
                this.form.totals = {
                    borderMonitoringStation: {},
                    other: {},
                    safeHouse: {}
                };
                this.getAllData();
            });
        } else {
            this.form.month_year = window.moment().format();
            this.getAllData();
        }
    }

    getOtherData() {
        this.form.other = {};
        if (this.utils.validId(this.budgetId)) {
            for (let key in Constants.FormSections) {
                this.service.getOtherItems(this.budgetId, Constants.FormSections[key]).then((response) => {
                    this.form.other[key] = response.data;
                });
            }
        } else {
            for (let key in Constants.FormSections) {
                this.form.other[key] = [];
            }
        }
    }

    getPreviousData() {
        let month = window.moment(this.form.month_year).format('M');
        let year = window.moment(this.form.month_year).format('YYYY');
        this.service.getPreviousData(this.form.border_station, month, year).then((response) => {
            this.form.previousData = response.data;
        });
    }

    getStaff() {
        this.service.getStaff(this.form.border_station).then((response) => {
            this.form.staff = response.data.results;
            this.getStaffSalaries();
        });
    }

    getStaffSalaries() {
        if (this.utils.validId(this.budgetId)) {
            this.service.getStaffSalaries(this.budgetId).then((response) => {
                this.form.staff.map((staff) => {
                    if (response.data.length > 0) {
                        staff.salaryInfo = $.grep(response.data, (s) => { return s.staff_person === staff.id; })[0];
                    } else {
                        staff.salaryInfo = { salary: 0 };
                    }
                });
                this.setTotals();
            });
        }
    }
    // ENDREGION: GET Calls


    // REGION: PUT Calls
    updateOrCreateAll() {
        this.updateOrCreateSalaries();
        this.updateOrCreateOtherItems();
        this.deleteOtherItems();
        this.$state.go('budgetList');
    }

    updateOrCreateForm() {
        if (this.isCreating) {
            this.service.createForm(this.form).then((response) => {
                this.budgetId = response.data.id;
                this.updateOrCreateAll();
                window.toastr.success(`${this.form.station_name} Budget Form Created Successfully!`);
            });
        } else {
            this.service.updateForm(this.budgetId, this.form).then(() => {
                window.toastr.success(`${this.form.station_name} Budget Form Updated Successfully!`);
            });
            this.updateOrCreateAll();
        }
    }

    updateOrCreateOtherItems() {
        for (let section in this.form.other) {
            for (let i in this.form.other[section]) {
                let item = this.form.other[section][i];
                if (item.id) {
                    this.service.updateOtherItem(this.budgetId, item);
                } else {
                    item.budget_item_parent = this.budgetId;
                    item.form_section = Constants.FormSections[section];
                    this.service.createOtherItem(this.budgetId, item);
                }
            }
        }
    }

    updateOrCreateSalaries() {
        this.form.staff.forEach((staff) => {
            if (staff.salaryInfo && staff.salaryInfo.id) {
                this.service.updateSalary(this.budgetId, staff.salaryInfo);
            } else if (staff.salaryInfo && !staff.salaryInfo.id) {
                staff.salaryInfo.staff_person = staff.id;
                staff.salaryInfo.budget_calc_sheet = this.budgetId;
                this.service.createSalary(staff.salaryInfo);
            }
        });
    }
    // ENDREGION: PUT Calls
    // ENDREGION: Call to Service Functions

    clearValue(value) {
        let returnValue;
        if (typeof value === 'boolean') {
            returnValue = false;
        } else if (typeof value === 'number') {
            returnValue = 0;
        } else {
            returnValue = value;
        }
        return returnValue;
    }

    clearValues() {
        for (let key in this.form) {
            if (key !== 'border_station' || key !== 'id') {
                this.form[key] = this.clearValue(this.form[key]);
            }
        }

        for (let index in this.form.staff) {
            this.form.staff[index].salaryInfo.salary = this.clearValue(this.form.staff[index].salaryInfo.salary);
        }
        this.setTotals();
    }

}
