import createBudgetButtonTemplate from './create-budget.html';

class CreateBudgetController {
  constructor(BorderStationService, SessionService) {
    'ngInject';
    this.service = BorderStationService;
    this.session = SessionService;
  }

  $onInit() {
    this.service.getUserStations(this.session.user.id, 'BUDGETS', 'ADD').then((resp) => {
        this.borderStations = resp.data;
        this.selectedBorderStation = this.borderStations[0]; // initialize dropdown to first border station
    });
  }
}

const CreateButtonComponent = {
  templateUrl: createBudgetButtonTemplate,
  controller: CreateBudgetController,
};

export default CreateButtonComponent;