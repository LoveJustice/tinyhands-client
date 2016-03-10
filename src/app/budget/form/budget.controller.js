export default class BudgetController {
  constructor($scope, $http, $location, $stateParams, $window, BudgetService) {
    'ngInject';

    this.service = BudgetService;


    // Variable Declarations
    let budgetFormPath = 'app/budget/form/components/';
    this.sections = {allSections: [{ name: 'Administration', templateUrl: `${budgetFormPath}administration/administrationForm.html` },
                                   { name: 'Awareness', templateUrl: `${budgetFormPath}awareness/awarenessForm.html` },
                                   { name: 'Communication', templateUrl: `${budgetFormPath}communication/communicationForm.html` },
                                   { name: 'Food And Gas', templateUrl: `${budgetFormPath}foodAndGas/foodAndGasForm.html` },
                                   { name: 'Medical', templateUrl: `${budgetFormPath}medical/medicalForm.html` },
                                   { name: 'Miscellaneous', templateUrl: `${budgetFormPath}miscellaneous/miscellaneousForm.html` },
                                   { name: 'Salaries', templateUrl: `${budgetFormPath}salaries/salariesForm.html` },
                                   { name: 'Shelter', templateUrl: `${budgetFormPath}shelter/shelterForm.html` },
                                   { name: 'Supplies', templateUrl: `${budgetFormPath}supplies/suppliesForm.html` },
                                   { name: 'Travel', templateUrl: `${budgetFormPath}travel/travelForm.html` }],
      borderMonitoringStationSections: ['Administration', 'Communication', 'Medical', 'Miscellaneous', 'Salaries', 'Travel'],
      safeHouseSections: ['Shelter', 'Food and Gas'],
      otherSections: ['Awareness', 'Supplies']
    };
    this.active = null;
    this.sectionTemplateUrl = null;

    this.budgetId = $stateParams.id;
    this.form = {};
    this.salariesTotal = 0;

    this.miscTotalValue = 0;
    this.travelTotalValue = 0;
    this.awarenessTotalValue = 0;
    this.suppliesTotalValue = 0;
    this.shelterTotalValue = 0;
    this.foodGasTotalValue = 0;
    this.communicationTotalValue = 0;
    this.staffTotalValue = 0;

    this.otherTravelTotalValue = [0];
    this.otherMiscTotalValue = [0];
    this.otherAwarenessTotalValue = [0];
    this.otherSuppliesTotalValue = [0];
    this.otherShelterTotalValue = [0];
    this.otherFoodGasTotalValue = [0];
    this.otherCommunicationTotalValue = [0];
    this.otherStaffTotalValue = [0];


    // Budget Calc sheets are for the 15th of every month
    this.date =  new Date();
    var thisMonth = this.date.getMonth();
    this.date.setMonth(thisMonth + 1);

    this.form.station_name = window.station_name;

    this.otherItemsTotals = [this.otherTravelTotalValue,
                            this.otherMiscTotalValue,
                            this.otherAwarenessTotalValue,
                            this.otherSuppliesTotalValue,
                            this.otherShelterTotalValue,
                            this.otherFoodGasTotalValue,
                            this.otherCommunicationTotalValue,
                            this.otherStaffTotalValue];


    // Event Listeners
    // $scope.$on('handleOtherItemsTotalChangeBroadcast', (event, args) => {
    //   this.otherItemsTotals[args['form_section'] - 1][0] = args['total'];
    //   this.callTotals();
    // });

    // $scope.$on('handleSalariesTotalChangeBroadcast', (event, args) => {
    //   this.salariesTotal = args['total'];
    // });

    // $scope.$on('lastBudgetTotalBroadcast', (event, args) => {
    //   this.last_months_total_cost = args['total'];
    // });

    this.getBudgetForm();
  }


  // Functions

  getBorderStation() {
    this.service.getBorderStation(this.form.border_station).then((response) => {
      this.form.station_name = response.data.station_name;
    });
  }

  getBudgetForm() {
    this.service.getBudgetForm(this.budgetId).then((response) => {
      this.form = response.data;
      this.getStaff();
      this.getBorderStation();
    });
  }

  getOtherStaff() {
    this.service.getOtherItems(this.budgetId, 8).then((response) => {
      this.form.otherStaff = response.data.results;
    });
  }

  getStaff() {
    this.service.getStaff(this.form.border_station).then((response) => {
      this.form.staff = response.data.results;
      this.getStaffSalaries();
      this.getOtherStaff();
    });
  }

  getStaffSalaries() {
    this.service.getStaffSalaries(this.form.border_station).then((response) => {
      this.form.staff.map((staff) => {
        staff.salaryInfo = $.grep(response.data, (s) => { return s.staff_person === staff.id; })[0];
      });
    });
  }

  //Determine the kind of functionality...view/create/edit
  main (){
    if( (window.submit_type) === 1 ) {
        this.create = true;
        this.retrieveNewForm();
    }
    else if( (window.submit_type) === 2)  {
        this.update = true;
        this.retrieveForm(window.budget_calc_id);
    }
    else if( (window.submit_type) === 3) {
        this.view = true;
        $('input').prop('disabled', true);
        this.retrieveForm(window.budget_calc_id);

    }
  }

  callTotals (){
    this.miscTotal();
    this.travelTotal();
    this.awarenessTotal();
    this.suppliesTotal();
    this.shelterTotal();
    this.foodGasTotal();
    this.communicationTotal();
    this.staffTotal();
  }


  foodAndShelterTotal () {
    return this.foodGasTotal() + this.shelterTotal();
  }

  bunchTotal() {
    return  this.communicationTotalValue +
            this.travelTotalValue +
            this.adminTotal() +
            this.medicalTotal() +
            this.miscTotalValue +
            this.staffTotal();
  }

  stationTotal() {
    return  this.foodAndShelterTotal() +
            this.bunchTotal() +
            this.awarenessTotalValue +
            this.suppliesTotalValue;
  }

  //CRUD Functions
  updateForm() {
    this.form.month_year = new Date(document.getElementById('month_year').value + '-15');
    this.mainCtrlService.updateForm(this.form.id, this.form).then((promise) => {
      this.id = promise.data.id;
      //Broadcast event to call the saveAllItems function in the otherItems controller
      this.$scope.$emit('handleBudgetCalcSavedEmit', {message: 'It is done.'});
      this.$window.location.assign('/budget/budget_calculations/money_distribution/view/' + this.id + '/');
    });
  }

  createForm() {
    this.form.month_year = new Date(document.getElementById('month_year').value + '-15');
    this.mainCtrlService.createForm(this.form).then((promise) => {
      var data = promise.data;
      this.id = data.id;
      window.budget_calc_id = data.id;
      this.$scope.$emit('handleBudgetCalcSavedEmit', {message: 'It is done.'}); //Broadcast event to call the saveAllItems function in the otherItems controller
      this.$window.location.assign('/budget/budget_calculations/money_distribution/view/' + this.id + '/');
    });
  }

  retrieveForm(id) {
    this.mainCtrlService.retrieveForm(id).then((promise) => {
      this.form = promise.data;
      this.form.month_year = new Date(promise.data.month_year);
      this.form.station_name = window.station_name;
      this.$scope.$emit('dateSetEmit', {date: promise.data.month_year});
      this.callTotals();
    });
  }

  retrieveNewForm() {
    this.mainCtrlService.retrieveNewForm(window.budget_calc_id).then((promise) => {
      var data = promise.data.budget_form;
      if (promise.data.None) {
        this.resetValuesToZero();
      }
      else {
        this.form = data;
      }
      this.form.station_name = window.station_name;
      this.form.month_year = this.date;
      this.form.next_month = this.next_month;
      data.members = [];
      data.id = undefined;
      this.callTotals();
    });
  }

  resetValuesToZero() {
    this.form = {
      border_station: window.border_station,
      shelter_shelter_startup_amount: 0,
      shelter_shelter_two_amount: 0,
      communication_chair: false,
      communication_chair_amount: 0,
      communication_manager: false,
      communication_manager_amount: 0,
      communication_number_of_staff_with_walkie_talkies: 0,
      communication_number_of_staff_with_walkie_talkies_multiplier: 0,
      communication_each_staff: 0,
      communication_each_staff_multiplier: 0,
      travel_chair_with_bike: false,
      travel_chair_with_bike_amount: 0,
      travel_manager_with_bike: false,
      travel_manager_with_bike_amount: 0,
      travel_number_of_staff_using_bikes: 0,
      travel_number_of_staff_using_bikes_multiplier: 0,
      travel_last_months_expense_for_sending_girls_home: 0,
      travel_motorbike: false,
      travel_motorbike_amount: 0,
      travel_plus_other: 0,
      administration_number_of_intercepts_last_month: 0,
      administration_number_of_intercepts_last_month_multiplier: 0,
      administration_number_of_intercepts_last_month_adder: 0,
      administration_number_of_meetings_per_month: 0,
      administration_number_of_meetings_per_month_multiplier: 0,
      administration_booth: false,
      administration_booth_amount: 0,
      administration_registration: false,
      administration_registration_amount: 0,
      medical_last_months_expense: 0,
      miscellaneous_number_of_intercepts_last_month: 0,
      miscellaneous_number_of_intercepts_last_month_multiplier: 0,
      shelter_rent: 0,
      shelter_water: 0,
      shelter_electricity: 0,
      shelter_shelter_startup: false,
      shelter_shelter_two: false,
      food_and_gas_number_of_intercepted_girls: 0,
      food_and_gas_number_of_intercepted_girls_multiplier_before: 0,
      food_and_gas_number_of_intercepted_girls_multiplier_after: 0,
      food_and_gas_limbo_girls_multiplier: 0,
      food_and_gas_number_of_limbo_girls: 0,
      food_and_gas_number_of_days: 0,
      awareness_contact_cards: false,
      awareness_contact_cards_boolean_amount: 0,
      awareness_contact_cards_amount: 0,
      awareness_awareness_party_boolean: false,
      awareness_awareness_party: 0,
      awareness_sign_boards_boolean: false,
      awareness_sign_boards: 0,
      supplies_walkie_talkies_boolean: false,
      supplies_walkie_talkies_amount: 0,
      supplies_recorders_boolean: false,
      supplies_recorders_amount: 0,
      supplies_binoculars_boolean: false,
      supplies_binoculars_amount: 0,
      supplies_flashlights_boolean: false,
      supplies_flashlights_amount: 0
    };
  }

}