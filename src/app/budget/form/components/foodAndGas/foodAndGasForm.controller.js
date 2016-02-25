export default class BudgetFoodAndGasFormController {
  foodGasInterceptedGirls (form) {
    return  form.food_and_gas_number_of_intercepted_girls_multiplier_before *
            form.food_and_gas_number_of_intercepted_girls *
            form.food_and_gas_number_of_intercepted_girls_multiplier_after;
  }

  foodGasLimboGirls (form) {
    return  form.food_and_gas_limbo_girls_multiplier *
            form.food_and_gas_number_of_limbo_girls *
            form.food_and_gas_number_of_days;
  }

  foodGasTotal() {
    var amount = 0;
    amount += this.foodTotal();
    this.otherfoodGasTotalValue = amount + this.otherFoodGasTotalValue[0];
    return this.otherfoodGasTotalValue;
  }

  foodTotal (form) {
    return this.foodGasInterceptedGirls(form) + this.foodGasLimboGirls(form);
  }
}