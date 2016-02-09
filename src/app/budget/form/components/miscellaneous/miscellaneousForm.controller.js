export default class MiscellaneousController {
  constructor() {

  }

  miscMaximum() {
    return this.form.miscellaneous_number_of_intercepts_last_month * this.form.miscellaneous_number_of_intercepts_last_month_multiplier;
  }
  
  miscTotal() {
    this.miscTotalValue = this.miscMaximum() + this.otherMiscTotalValue[0];
  }
}