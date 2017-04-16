export default class VifListController {
    constructor(VifListService, SessionService, StickyHeader, $state, $stateParams, $timeout, $window, toastr, constants) {
        'ngInject';

        this.constants = constants;
        this.service = VifListService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.sticky = StickyHeader;
        this.state = $state;
        this.timeout = $timeout;
        this.window = $window;
        this.toastr = toastr;

        this.timer = {};
        this.vifs = [];
        this.timeZoneDifference ="+0545";
        this.nextPage = "";
        this.queryParameters = {
            "page_size": 25,
            "reverse": true,
            "ordering": 'date',
            "search": ''
        };
        this.stickyOptions = this.sticky.stickyOptions;

        // If there was a search value provided in the url, set it
        if($stateParams) {
            this.queryParameters.search = $stateParams.search;
        }
        this.getVifList();
        this.checkForExistingVifs();
    }

    transform(queryParams) {
        var queryParameters = angular.copy(queryParams);
        if (queryParameters.reverse) {
            queryParameters.ordering = '-' + queryParameters.ordering;
        }
        delete queryParameters.reverse;
        var params = [];
        Object.keys(queryParameters).forEach( (name) => {
            params.push({"name": name, "value": queryParameters[name]});
        });
        return params;
    }

    extractPage(url) {
        try {
            return url.slice(url.indexOf('page=')).split('&')[0].split('=')[1];
        } catch (e) {
            return 0;
        }
    }

    searchVifs() {
        this.timeout.cancel(this.timer);
        this.timer = this.timeout( () => {
            this.state.go('vifList', {search: this.queryParameters.search}, {reload: false, notify: false});
            this.getVifList();
        }, 500);
    }

    getSortIcon(column, reverse) {
        if(reverse === 'reverse'){
            return (column === this.queryParameters.ordering) && this.queryParameters.reverse;
        }
        return (column === this.queryParameters.ordering) && !this.queryParameters.reverse;
    }

    updateSort(column) {
        if (column === this.queryParameters.ordering) {
            this.queryParameters.reverse = ! this.queryParameters.reverse;
        }
        this.queryParameters.ordering = column;
        this.getVifList();
    }

    getVifList() {
        this.service.getVifList(this.transform(this.queryParameters)).then( (promise) => {
            this.vifs = promise.data.results;
            this.nextPage = this.extractPage(promise.data.next);
        });
    }

    showMoreVifs() {
        var params = angular.copy(this.queryParameters);
        params.page = this.nextPage;
        this.service.getMoreVifs(this.transform(params)).then( (promise) => {
            this.vifs = this.vifs.concat(promise.data.results);
            this.nextPage = this.extractPage(promise.data.next);
        });
    }

    deleteVif(vif, index) {
        if (vif.confirmedDelete) {
            this.service.deleteVif(vif.id).then(
                () => {
                    this.toastr.success("Successfully Deleted VIF!");
                    this.vifs.splice(index, 1);
                },
                () => {
                    this.toastr.error("Unable to Delete VIF!");
                }
            );
        }
        else {
            vif.confirmedDelete = true;
        }
    }

    checkForExistingVifs() {
        var savedForLaterVifs = this.getSaveForLaterObject();
        if (savedForLaterVifs === null) { return; }

        savedForLaterVifs = Object.keys(savedForLaterVifs);
        savedForLaterVifs.forEach((vifNumber) => {
            this.service.vifExists(vifNumber).then((promise) => {
                if (promise.data === vifNumber) {
                    this.removeVifFromSaveForLater(vifNumber);
                }
            });
        });
    }

    removeVifFromSaveForLater(vifNumber) {
        var obj = this.getSaveForLaterObject();
        delete obj[vifNumber];
        localStorage.setItem('saved-vifs', JSON.stringify(obj));
    }

    getSaveForLaterObject() {
        return JSON.parse(localStorage.getItem('saved-vifs'));
    }
}
