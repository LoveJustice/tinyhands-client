export default class VifListController {
    constructor(VifListService, session) {
        'ngInject';

        this.service = VifListService;
        this.session = session;

        this.numShowing = 25;
        this.paginateBy = 25;
        this.reverse = false;
        this.searchValue = "";
        this.showingVifs = [];
        this.sort = 'vif_number';

        this.getVifList();
    }

    deleteVif(id) {
        this.service.deleteVif(id);
    }

    getCsvArray() {
        this.getArray = [];
        var i;
        for (i = 0; i < this.showingVifs.length; i++) {
            this.getArray.push(
                {'Vif #': this.showingVifs[i].vif_number,
                'Interviewer': this.showingVifs[i].interviewer,
                '# of Victims': this.showingVifs[i].number_of_victims,
                '# of Traffickers': this.showingVifs[i].number_of_traffickers,
                'Date of Interview': this.showingVifs[i].date,
                'Time Entered Into System': this.showingVifs[i].date_time_entered_into_system,
                'Time Last Edited': this.showingVifs[i].date_time_last_updated}
            );
        }
        return this.getArray;
    }

    getCsvHeader() {
        return ['Vif #', 'Interviewer', '# of Victims', '# of Traffickers', 'Date of Interview', 'Time Entered Into System', 'Time Last Edited'];
    }

    getVifList() {
        this.numShowing = this.paginateBy;

        this.service.getVifList().then((response) => {
            this.listOfVifs = response.data.results;
            this.showingVifs = this.listOfVifs.slice(0, this.numShowing);
        });
    }

    getSort() {
        if (this.reverse === false) {
            return this.sort;
        } else {
            return "-" + this.sort;
        }
    }

    showMoreVifs() {
        this.numShowing = parseInt(this.numShowing) + parseInt(this.paginateBy);
        this.showingVifs = this.listOfVifs.slice(0, this.numShowing);
    }

    sortCol(column) {
        this.sort = column;
        this.reverse = !this.reverse;
    }
}