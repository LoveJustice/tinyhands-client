class CreateBudgetController {
  constructor($scope, BorderStationService) {
    'ngInject';
    this.$scope = $scope;
    this.service = BorderStationService;
  }

  $onInit() {
    this.service.getBorderStations().then((resp) => {
        this.borderStations = resp.data;
        this.selectedBorderStation = 0;
    });
  }
}

const CreateButtonComponent = {
  templateUrl: require('./create-budget.html'),
  controller: CreateBudgetController,
};

export default CreateButtonComponent;