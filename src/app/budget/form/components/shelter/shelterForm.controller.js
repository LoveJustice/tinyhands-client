export default class BudgetShelterFormController {
  constructor() {

  }

  utilTotal() {
    return (this.form.shelter_rent + this.form.shelter_water + this.form.shelter_electricity);
  }

  shelterCheckboxTotal() {
    var totalAmount = 0;
    if (this.form.shelter_shelter_startup) {
        totalAmount += this.form.shelter_shelter_startup_amount;
    }
    if (this.form.shelter_shelter_two) {
        totalAmount += this.form.shelter_shelter_two_amount;
    }
    return totalAmount;
  }

  shelterTotal() {
    var amount = 0;
    amount += this.form.shelter_rent +
            this.form.shelter_water +
            this.form.shelter_electricity +
            this.shelterCheckboxTotal();
    this.shelterTotalValue = amount + this.otherShelterTotalValue[0];
    return this.shelterTotalValue;
  }
}