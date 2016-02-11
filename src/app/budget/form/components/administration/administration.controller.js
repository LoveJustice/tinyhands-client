export default class AdministrationController {
  constructor() {

  }
  
  adminStationaryTotal() {
    return (this.form.administration_number_of_intercepts_last_month * this.form.administration_number_of_intercepts_last_month_multiplier) + this.form.administration_number_of_intercepts_last_month_adder;
  }

  adminMeetingsTotal() {
    return this.form.administration_number_of_meetings_per_month * this.form.administration_number_of_meetings_per_month_multiplier;
  }

  adminBoothRentalTotal() {
    var amount = 0;
    if(this.form.administration_booth) {
        amount += this.form.administration_booth_amount;
    }
    if(this.form.administration_registration) {
        amount += this.form.administration_registration_amount;
    }
    return amount;
  }

  adminTotal() {
    return this.adminStationaryTotal() + this.adminMeetingsTotal() + this.adminBoothRentalTotal();
  }
}