export default class BudgetList {
  constructor(BudgetListService) {
    'ngInject';
    this.service = BudgetListService;

    this.getBudgetList();
  }

  getBudgetList() {
    this.service.getBudgetList().then((response) => {
      console.log(response);
      this.listOfBudgets = response.data.results;
    });
  }
}