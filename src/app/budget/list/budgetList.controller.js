export default class BudgetList {
  constructor($uibModal, BudgetListService, session) {
    'ngInject';

    this.$uibModal = $uibModal;
    this.service = BudgetListService;
    this.session = session;

    this.getBudgetList();
  }

  getBudgetList() {
    this.service.getBudgetList().then((response) => {
      this.listOfBudgets = response.data.results;
      this.listOfBudgets.map(
        (form) => {
          form.month_year = window.moment(form.month_year).format('MMMM YYYY');
          form.date_time_entered = window.moment(form.date_time_entered).format('LLL');
          form.date_time_last_updated = window.moment(form.date_time_last_updated).format('LLL');
        });
      console.log(this.listOfBudgets);
    });
  }

  removeBudget(array, budget) {
    if (budget.budgetRemoved) {
      this.service.deleteBorderStationBudget(budget.id).then((response) => {
        if (response.status === 204 || response.status === 200) {
          window.toastr.success("Form Successfully Deleted");
          var index = this.listOfBudgets.indexOf(budget);
          this.listOfBudgets.splice(index, 1);
        } else {
          window.toastr.error("Unable to Delete Budget Form");
        }
      });
    } else {
      budget.budgetRemoved = true;
    }
  }

}