export default class FoodAndGasController {
  constructor() {

  }
  
  foodGasInterceptedGirls () {
    return  this.form.food_and_gas_number_of_intercepted_girls_multiplier_before *
            this.form.food_and_gas_number_of_intercepted_girls *
            this.form.food_and_gas_number_of_intercepted_girls_multiplier_after;
  }

  foodGasLimboGirls () {
    return  this.form.food_and_gas_limbo_girls_multiplier *
            this.form.food_and_gas_number_of_limbo_girls *
            this.form.food_and_gas_number_of_days;
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