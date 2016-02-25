export default class BudgetTravelFormController {
  travelMotorbikeOtherTotal(form) {
    var returnVal = 0;
    if(form.travel_motorbike) {
        returnVal = form.travel_motorbike_amount;
    }
    return returnVal + form.travel_plus_other;
  }

  travelNumberOfStaffUsingBikesTotal(form) {
    return form.travel_number_of_staff_using_bikes * form.travel_number_of_staff_using_bikes_multiplier;
  }

  travelTotal(form) {
    var amount = 0;
    if(form.travel_chair_with_bike) {
        amount += form.travel_chair_with_bike_amount;
    }
    if(form.travel_manager_with_bike) {
        amount += form.travel_manager_with_bike_amount;
    }
    if(form.travel_motorbike) {
        amount += form.travel_motorbike_amount;
    }
    // this.travelTotalValue = amount + form.travel_plus_other + form.travel_last_months_expense_for_sending_girls_home + (form.travel_number_of_staff_using_bikes * form.travel_number_of_staff_using_bikes_multiplier) + this.otherTravelTotalValue[0];
    return amount + form.travel_plus_other + form.travel_last_months_expense_for_sending_girls_home + (form.travel_number_of_staff_using_bikes * form.travel_number_of_staff_using_bikes_multiplier);
  }
}