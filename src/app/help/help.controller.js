import './help.less';

/* global angular */

export default class HelpController {
    constructor(helpService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $timeout) {
        'ngInject';
        this.service = helpService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.timer = {};

        this.helpVideos = [];
        this.nextPage = "";
        this.queryParameters = {
            "page_size": 25,
            "reverse": false,
            "ordering": 'title',
            "search": '',
        };
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;

        // If there was a search value provided in the url, set it
        let foundStateParams = false;
        if($stateParams) {
           if ($stateParams.search) {
               foundStateParams = true;
               this.queryParameters.search = $stateParams.search;
           }
        }
        
        if (!foundStateParams) {
            let tmp = sessionStorage.getItem('help-search');
            if (tmp !== null) {
                this.queryParameters.search = tmp;
            }
        }

        this.getHelpVideos();
    }

    transform(queryParams) {
        var queryParameters = angular.copy(queryParams);
        if (queryParameters.reverse) {
            queryParameters.ordering = '-' + queryParameters.ordering;
        }
        delete queryParameters.reverse;
        var params = [];
        Object.keys(queryParameters).forEach( (name) => {
            if (queryParameters[name] !== null && queryParameters[name] !== '') {
                params.push({"name": name, "value": queryParameters[name]});
            }
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

    searchHelpVideos() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('help-search', this.queryParameters.search);
        this.timer = this.timeout( () => {
            this.state.go('.', {
                search: this.queryParameters.search});
            this.getHelpVideos();
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
        this.getHelpVideos();
    }

    getHelpVideos() {
        this.spinnerOverlayService.show("Searching for Help Videos...");        
        this.service.getHelpVideos(this.transform(this.queryParameters)).then( (promise) => {
            this.helpVideos = promise.data.results;
            this.nextPage = this.extractPage(promise.data.next);
            this.spinnerOverlayService.hide();        
        });
    }

    showMoreHelpVideos() {
        let params = angular.copy(this.queryParameters);
        params.page = this.nextPage;
        this.service.getMoreHelpVideos(this.transform(params)).then( (promise) => {
            this.monthlyReports = this.monthlyReports.concat(promise.data.results);
            this.nextPage = this.extractPage(promise.data.next);
        });
    }
    
    viewVideo(url) {
        this.state.go('viewvideo',{
            videoUrl:url});
    }
}
