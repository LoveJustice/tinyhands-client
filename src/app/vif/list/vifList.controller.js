export default class VifListController {
  constructor(VifListService, session) {
    'ngInject';
    this.service = VifListService;
    this.session = session;
    this.sort = 'vif_number';
    this.reverse = false;
    this.searchValue = "";

    this.getVifList();
  }

  getVifList() {
    this.service.getVifList().then((response) => {
      this.listOfVifs = response.data.results;
    });
  }

  getSort() {
    if(this.reverse == false) {
      return this.sort;
    } else {
      return "-" + this.sort;
    }
  }

  reverseList() {
    this.reverse = !this.reverse;
  }
}