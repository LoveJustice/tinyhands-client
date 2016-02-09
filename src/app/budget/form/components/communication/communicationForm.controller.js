export default class CommunicationController {
  constructor() {

  }

  commManagerTotal () {
      var amount = 0;

      if (this.form.communication_chair) {
          amount += this.form.communication_chair_amount;
      }
      if (this.form.communication_manager) {
          amount += this.form.communication_manager_amount;

      }
      return amount;
  }

  commNumberOfStaffTotal () {
    return  this.form.communication_number_of_staff_with_walkie_talkies *
            this.form.communication_number_of_staff_with_walkie_talkies_multiplier;
  }

  commEachStaffTotal () {
    return  this.form.communication_each_staff *
            this.form.communication_each_staff_multiplier;
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