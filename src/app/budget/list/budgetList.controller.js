export default class BudgetList {
  constructor(BudgetListService) {
    'ngInject';
    this.service = BudgetListService;

    this.getBudgetList();
  }

  getBudgetList() {
    this.service.getBudgetList().then((response) => {
      this.listOfBudgets = response.data.results;
    });
  }

  deleteBorderStationBudget(id) {
    this.service.deleteBorderStationBudget(id);
  }
}