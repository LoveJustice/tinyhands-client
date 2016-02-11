export default class BudgetList {
  constructor(BudgetListService) {
    'ngInject';

    this.service = BudgetListService;

    this.listOfBudgets = {};
  }

  getBudgetList() {
    this.service.getBudgetList().then((response) => {
      console.log(response);
    });
  }
}