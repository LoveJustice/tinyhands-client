export default class BudgetFoodAndGasFormController {
  constructor() {

  }

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

  foodTotal () {
    return this.foodGasInterceptedGirls() + this.foodGasLimboGirls();
  }
}