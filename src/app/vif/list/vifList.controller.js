export default class VifListController {
    constructor(VifListService, session) {
        'ngInject';
        this.service = VifListService;
        this.session = session;
        this.sort = 'vif_number';
        this.showingVifs = [];
        this.reverse = false;
        this.paginateBy = 25;
        this.numShowing = 25;
        this.searchValue = "";

        this.getVifList();
    }

    getVifList() {
        this.numShowing = this.paginateBy;

        this.service.getVifList().then((response) => {
            this.listOfVifs = response.data.results;
            this.showingVifs = this.listOfVifs.slice(0, this.numShowing);
        });
    }

    getSort() {
        if (this.reverse == false) {
            return this.sort;
        } else {
            return "-" + this.sort;
        }
    }

    reverseList() {
        this.reverse = !this.reverse;
    }

    showMoreVifs() {
        this.numShowing = parseInt(this.numShowing) + parseInt(this.paginateBy);
        this.showingVifs = this.listOfVifs.slice(0, this.numShowing);
    }

    deleteVif(id) {
        this.service.deleteVif(id);
    }

    cleanDeleteUrl(url) {
        return String(url).replace("http/:","");
    }
}