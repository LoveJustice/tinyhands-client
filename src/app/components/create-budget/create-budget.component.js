import createBudgetButtonTemplate from './create-budget.html';

class CreateBudgetController {
  constructor(BorderStationService) {
    'ngInject';
    this.service = BorderStationService;
  }

  $onInit() {
    this.service.getBorderStations().then((resp) => {
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