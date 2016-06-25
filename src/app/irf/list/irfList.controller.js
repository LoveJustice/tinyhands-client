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
            "reverse": true,
            "ordering": 'irf_number',
            "search": ''
        };
        // If there was a search value provided in the url, set it
        if($stateParams) {
            this.queryParameters.search = $stateParams.search;
        }

        this.getIrfList(this.queryParameters);
    }

    getIrfList() {
        this.service.getIrfList(this.queryParameters).then( (promise) => {
            this.irfs = promise.data.results;
            this.nextPage = this.extractPage(promise.data.next);
        })
    }

    extractPage(url) {
        return url.slice(url.indexOf('page=')).split('&')[0].split('=')[1]
    }

    searchIrfs() {
        this.timeout.cancel(this.timer);
        this.timer = this.timeout( () => {
            this.getIrfList();
            console.log('update with timeout fired')
        }, 500);
    }

    getSortIcon(column, reverse) {
        if(reverse === 'reverse'){
            return (column === this.queryParameters.ordering) && !this.queryParameters.reverse;
        }
        return (column === this.queryParameters.ordering) && this.queryParameters.reverse;
    }

    updateSort(column) {
        if (column === this.queryParameters.ordering) {
            this.queryParameters.reverse = ! this.queryParameters.reverse;
        }
        this.queryParameters.ordering = column;
        this.getIrfList();
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
