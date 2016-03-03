export default class IrfListController {
  constructor(IrfListService) {
    'ngInject';
    this.service = IrfListService;

    this.getIrfList();
  }

  getIrfList() {
    this.service.getIrfList().then((response) => {
      this.listOfIrfs = response.data.results;
    });
  }
}
