export default class BudgetList {
  constructor($uibModal, BudgetListService) {
    'ngInject';

    this.$uibModal = $uibModal;
    this.service = BudgetListService;

    this.getBudgetList();
  }

  deleteBorderStationBudget(id) {
    this.service.deleteBorderStationBudget(id);
  }

  getBudgetList() {
    this.service.getBudgetList().then((response) => {
      this.listOfBudgets = response.data.results;
    });
  }

  removeBudget(array, instance) {
    if (instance.budgetRemoved) {
      //remove the things
    } else {
      instance.budgetRemoved = true;
    }
  }

}