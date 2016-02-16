export default class BudgetMedicalFormController {
  constructor() {

  }

  medicalTotal() {
    return this.form.medical_last_months_expense;
  }
}