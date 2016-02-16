export default class BudgetList {
  constructor(BudgetListService) {
    'ngInject';
    this.service = BudgetListService;

    this.compileBudgetListInfo();

  }

  getBudgetList() {
    this.service.getBudgetList().then((response) => {
      console.log(response);
      this.listOfBudgets = response.data.results;
    });
  }

  compileBudgetListInfo() {
    this.getBudgetList();
    this.getBorderStationCodes();
  }

  getBorderStationCodes() {
    this.service.getBorderStationCodes().then((response) => {
      console.log(response);
      this.stationCodes = response.data;
      this.codesArray = {};
      this.stationCodes.forEach(function(element) {
        this.codesArray[element.id] = element.station_code;
      }, this);
    });
  }

  deleteBorderStationBudget(id) {
    this.service.deleteBorderStationBudget(id).then((response) => {
      console.log(response);
    });
  }
}