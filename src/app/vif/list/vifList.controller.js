export default class VifListController {
  constructor(VifListService) {
    'ngInject';
    this.service = VifListService;

    this.getVifList();
  }

  getVifList() {
    this.service.getVifList().then((response) => {
      this.listOfVifs = response.data.results;
    });
  }
}