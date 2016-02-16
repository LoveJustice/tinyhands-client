export default class BudgetCommunicationFormController {
  constructor() {

  }

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

  communicationTotal () {
    var amount = 0;
    amount += this.commTotal();
    this.communicationTotalValue = amount + this.otherCommunicationTotalValue[0];
  }

  commTotal () {
    return this.commManagerTotal() + this.commNumberOfStaffTotal() + this.commEachStaffTotal();
  }
}