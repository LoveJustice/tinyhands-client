export default class IrfListController {
    constructor(IrfListService, SessionService, StickyHeader, $stateParams, $timeout, $window, toastr, constants) {
        'ngInject';
        this.service = IrfListService;
        this.session = SessionService;
        this.sticky = StickyHeader;
        this.timeout = $timeout;
        this.window = $window;
        this.toastr = toastr;
        this.constants = constants;


        this.timer = {};
        this.irfs = [];
        this.nextPage = "";
        this.timeZoneDifference ="+0545";
        this.queryParameters = {
            "page_size": 25,
            "reverse": false,
            "ordering": 'irf_number',
            "search": ''
        };
        this.stickyOptions = this.sticky.stickyOptions;

        // If there was a search value provided in the url, set it
        if($stateParams) {
            this.queryParameters.search = $stateParams.search;
        }
        this.getIrfList();
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

    searchIrfs() {
        this.timeout.cancel(this.timer);
        this.timer = this.timeout( () => {
            this.getIrfList();
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
        this.getIrfList();
    }

    getIrfList() {
        this.service.getIrfList(this.transform(this.queryParameters)).then( (promise) => {
            this.irfs = promise.data.results;
            this.nextPage = this.extractPage(promise.data.next);
        });
    }

    showMoreIrfs() {
        var params = angular.copy(this.queryParameters);
        params.page = this.nextPage;
        this.service.getMoreIrfs(this.transform(params)).then( (promise) => {
            this.irfs = this.irfs.concat(promise.data.results);
            this.nextPage = this.extractPage(promise.data.next);
        });
    }

    deleteIrf(irf, index) {
        if (irf.confirmedDelete) {
            this.service.deleteIrf(irf.id).then(
                () => {
                    this.toastr.success("Successfully Deleted IRF!");
                    this.irfs.splice(index, 1);
                },
                () => {
                    this.toastr.error("Unable to Delete IRF!");
                }
            );
        }
        else {
            irf.confirmedDelete = true;
        }
    }
}
