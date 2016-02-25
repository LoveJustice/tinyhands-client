export default class BudgetMiscellaneousFormController {
  miscMaximum(form) {
    return form.miscellaneous_number_of_intercepts_last_month * form.miscellaneous_number_of_intercepts_last_month_multiplier;
  }

  miscTotal() {
    this.miscTotalValue = this.miscMaximum() + this.otherMiscTotalValue[0];
  }
}