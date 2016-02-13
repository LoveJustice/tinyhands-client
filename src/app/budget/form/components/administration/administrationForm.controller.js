export default class BudgetAdministrationFormController {
  constructor() {

  }

  adminStationaryTotal(form) {
    return (form.administration_number_of_intercepts_last_month * form.administration_number_of_intercepts_last_month_multiplier) + form.administration_number_of_intercepts_last_month_adder;
  }

  adminMeetingsTotal(form) {
    return form.administration_number_of_meetings_per_month * form.administration_number_of_meetings_per_month_multiplier;
  }

  adminBoothRentalTotal(form) {
    var amount = 0;
    if(form.administration_booth) {
        amount += form.administration_booth_amount;
    }
    if(form.administration_registration) {
        amount += form.administration_registration_amount;
    }
    return amount;
  }

  adminTotal(form) {
    return this.adminStationaryTotal(form) + this.adminMeetingsTotal(form) + this.adminBoothRentalTotal(form);
  }
}