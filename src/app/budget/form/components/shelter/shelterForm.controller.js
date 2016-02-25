export default class BudgetShelterFormController {
  utilTotal(form) {
    return (form.shelter_rent + form.shelter_water + form.shelter_electricity);
  }

  shelterCheckboxTotal(form) {
    var totalAmount = 0;
    if (form.shelter_shelter_startup) {
        totalAmount += form.shelter_shelter_startup_amount;
    }
    if (form.shelter_shelter_two) {
        totalAmount += form.shelter_shelter_two_amount;
    }
    return totalAmount;
  }

  shelterTotal(form) {
    var amount = 0;
    amount += form.shelter_rent +
            form.shelter_water +
            form.shelter_electricity +
            this.shelterCheckboxTotal(form);
    // this.shelterTotalValue = amount + this.otherShelterTotalValue[0];
    return amount;
  }
}