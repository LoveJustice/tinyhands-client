export default class BudgetTravelFormController {
  constructor() {

  }

  travelNumberOfStaffUsingBikesTotal() {
    return this.form.travel_number_of_staff_using_bikes * this.form.travel_number_of_staff_using_bikes_multiplier;
  }

  travelMotorbikeOtherTotal() {
    var returnVal = 0;
    if(this.form.travel_motorbike) {
        returnVal = this.form.travel_motorbike_amount;
    }
    return returnVal + this.form.travel_plus_other;
  }

  travelTotal() {
    var amount = 0;
    if(this.form.travel_chair_with_bike) {
        amount += this.form.travel_chair_with_bike_amount;
    }
    if(this.form.travel_manager_with_bike) {
        amount += this.form.travel_manager_with_bike_amount;
    }
    if(this.form.travel_motorbike) {
        amount += this.form.travel_motorbike_amount;
    }
    this.travelTotalValue = amount + this.form.travel_plus_other + this.form.travel_last_months_expense_for_sending_girls_home + (this.form.travel_number_of_staff_using_bikes * this.form.travel_number_of_staff_using_bikes_multiplier) + this.otherTravelTotalValue[0];
  }
}