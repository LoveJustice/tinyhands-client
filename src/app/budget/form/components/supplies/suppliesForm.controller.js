export default class BudgetSuppliesFormController {
  suppliesTotal(form) {
    var amount = 0;
    if(form.supplies_walkie_talkies_boolean) {
        amount += form.supplies_walkie_talkies_amount;
    }
    if(form.supplies_recorders_boolean) {
        amount += form.supplies_recorders_amount;
    }
    if(form.supplies_binoculars_boolean) {
        amount += form.supplies_binoculars_amount;
    }
    if(form.supplies_flashlights_boolean) {
        amount += form.supplies_flashlights_amount;
    }
    // this.suppliesTotalValue = amount + this.otherSuppliesTotalValue[0];
    return amount;
  }
}