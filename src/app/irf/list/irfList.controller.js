export default class IrfListController {
    constructor(IrfListService, session) {
        'ngInject';

        this.service = IrfListService;
        this.session = session;

        this.numShowing = 25;
        this.paginateBy = 25;
        this.reverse = false;
        this.searchValue = '';
        this.showingIrfs = [];
        this.sort = 'irf_number';

        this.getIrfList();
    }

    getIrfList() {
        this.numShowing = this.paginateBy;

        this.service.getIrfList().then((response) => {
            this.listOfIrfs = response.data.results;
            this.showingIrfs = this.listOfIrfs.slice(0, this.numShowing);
        });
    }

    getSort() {
        if (this.reverse === false) {
            return this.sort;
        } else {
            return '-' + this.sort;
        }
    }

    reverseList() {
        this.reverse = !this.reverse;
    }

    showMoreIrfs() {
        this.numShowing = parseInt(this.numShowing) + parseInt(this.paginateBy);
        this.showingIrfs = this.listOfIrfs.slice(0, this.numShowing);

    }

    deleteIrf(id) {
        this.service.deleteIrf(id);
    }

    cleanDeleteUrl(url) {
        return String(url).replace('http/:','');
    }

    getCsvArray() {
        //[{'Irf #'}, {'Staff Name'}, {'# of Victims'}, {'# of Traffickers'}, {'Date of Interception'}, {'Time Entered Into System'}, {'Time Last Edited'}];
        this.getArray = [];
        var i;
        for (i = 0; i < this.showingIrfs.length; i++) {
            this.getArray.push(
                {'Irf #': this.showingIrfs[i].irf_number,
                'Staff Name': this.showingIrfs[i].staff_name,
                '# of Victims': this.showingIrfs[i].number_of_victims,
                '# of Traffickers': this.showingIrfs[i].number_of_traffickers,
                'Date of Interception': this.showingIrfs[i].date,
                'Time Entered Into System': this.showingIrfs[i].date_time_entered_into_system,
                'Time Last Edited': this.showingIrfs[i].date_time_last_updated}
            );
        }
        return this.getArray;
    }

    getCsvHeader() {
        return ['Irf #', 'Staff Name', '# of Victims', '# of Traffickers', 'Date of Interception', 'Time Entered Into System', 'Time Last Edited'];
    }
}