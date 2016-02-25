export default class BudgetList {
  constructor($uibModal, BudgetListService) {
    'ngInject';

    this.$uibModal = $uibModal;
    this.service = BudgetListService;

    this.getBudgetList();
  }

  deleteBorderStationBudget(id) {
  }

  getBudgetList() {
    this.service.getBudgetList().then((response) => {
      this.listOfBudgets = response.data.results;
    });
  }

  removeBudget(array, budget) {
    if (budget.budgetRemoved) {
      this.service.deleteBorderStationBudget(budget.id).then((response) => {
        if (response.status == 204 || response.status == 200) {
          toastr.success("Form Successfully Deleted");
          var index = this.listOfBudgets.indexOf(budget);
          this.listOfBudgets.splice(index, 1);
        } else {
          toastr.error("Unable to Delete Budget Form");
        }
      });
    } else {
      budget.budgetRemoved = true;
    }
  }

}