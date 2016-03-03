export default class VifListController {
  constructor(VifListService, session) {
      'ngInject';
      this.service = VifListService;
      this.session = session;
      this.getVifList();
  }

  getVifList() {
    this.service.getVifList().then((response) => {
      this.listOfVifs = response.data.results;
    });
  }
}