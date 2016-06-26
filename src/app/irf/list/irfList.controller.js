export default class IrfListController {
    constructor(IrfListService, SessionService, $stateParams, $timeout) {
        'ngInject';
        this.service = IrfListService;
        this.session = SessionService;
        this.timeout = $timeout;

        this.timer = {};
        this.irfs = [];
        this.nextPage = "";
        this.queryParameters = {
            "page_size": 25,
            "reverse": false,
            "ordering": 'irf_number',
            "search": ''
        };

        // TODO: Add authentication dom stuff to the controller for edit/view/delete buttons

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
        return url.slice(url.indexOf('page=')).split('&')[0].split('=')[1];
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
        this.service.getMoreIrfs(params).then( (promise) => {
            this.irfs = this.irfs.concat(promise.data.results);
            this.nextPage = this.extractPage(promise.data.next);
        });
    }

    deleteIrf(id) {
        this.service.deleteIrf(id);
    }
}
