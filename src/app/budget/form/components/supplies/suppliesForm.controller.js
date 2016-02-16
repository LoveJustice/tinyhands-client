export default class BudgetSuppliesFormController {
  constructor() {

  }

  suppliesTotal() {
    var amount = 0;
    if(this.form.supplies_walkie_talkies_boolean) {
        amount += this.form.supplies_walkie_talkies_amount;
    }
    if(this.form.supplies_recorders_boolean) {
        amount += this.form.supplies_recorders_amount;
    }
    if(this.form.supplies_binoculars_boolean) {
        amount += this.form.supplies_binoculars_amount;
    }
    if(this.form.supplies_flashlights_boolean) {
        amount += this.form.supplies_flashlights_amount;
    }
    this.suppliesTotalValue = amount + this.otherSuppliesTotalValue[0];
  }
}