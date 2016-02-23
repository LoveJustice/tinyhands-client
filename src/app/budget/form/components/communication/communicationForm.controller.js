export default class BudgetCommunicationFormController {
  commManagerTotal (form) {
      var amount = 0;

      if (form.communication_chair) {
          amount += form.communication_chair_amount;
      }
      if (form.communication_manager) {
          amount += form.communication_manager_amount;

      }
      return amount;
  }

  commNumberOfStaffTotal (form) {
    return  form.communication_number_of_staff_with_walkie_talkies *
            form.communication_number_of_staff_with_walkie_talkies_multiplier;
  }

  commEachStaffTotal (form) {
    return  form.communication_each_staff *
            form.communication_each_staff_multiplier;
  }

  staffTotal () {
    this.staffTotalValue = this.salariesTotal + this.otherStaffTotalValue[0];
    return this.staffTotalValue;
  }

  communicationTotal (form) {
    var amount = 0;
    amount += this.commTotal(form);
    // this.communicationTotalValue = amount + this.otherCommunicationTotalValue[0];
    return amount;
  }

  commTotal (form) {
    return this.commManagerTotal(form) + this.commNumberOfStaffTotal(form) + this.commEachStaffTotal(form);
  }
}