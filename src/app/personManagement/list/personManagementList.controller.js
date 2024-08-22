class personManagementListController {
    constructor(StickyHeader, $rootScope, $scope, $http, $timeout, personManagementListService, BaseUrlService, $uibModal, $state, $stateParams, $document, toastr, constants) {
        'ngInject';

        this.state = $state;
        this.sticky = StickyHeader;
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.http = $http;
        this.timeout = $timeout;
        this.personManagementListService = personManagementListService;
        this.modal = $uibModal;
        this.toastr = toastr;
        this.constants = constants;

        this.loading = false;
        this.reverse = false;
        this.paginateBy = 25;
        this.knownPersons = [];
        this.searchValue = "";
        this.nextPageUrl = "";
        this.sortColumn = "";
        this.stickyOptions = this.sticky.stickyOptions;
        this.timer = {};
        this.addSearchValue = "";
        
        this.paginate = {
            items:0,
            pageSize:this.paginateBy,
            currentPage:1,
        };
        
        this.showIdMgmt = true;
        this.showAddAlias = false;
        this.showRemoveAlias = false;
        this.isViewing = false;
        
       this.showPopup=false;
        
        $scope.radioSelected=function(event, id) {
            this.addSelectedId = id;
        };
        
        let tmp = sessionStorage.getItem('personManagement-search');
        if (tmp !== null) {
            this.searchValue = tmp;
        }

        this.getReactUrl = (path) => {
           return BaseUrlService.getReactUrl(path);
        };

        this.getKnownPersons();
    }
    
    sortIcon(column) {
        if (column === this.sortColumn) {
            switch (column) {
                case "age":
                case "phone":
                    return this.reverse ? "glyphicon-sort-by-order-alt" : "glyphicon-sort-by-order";
                case "name":
                case "gender":
                case "address1":
                case "address2":
                    return this.reverse ? "glyphicon-sort-by-alphabet-alt" : "glyphicon-sort-by-alphabet";
                default:
                    return "glyphicon-sort";
            }
        }
        return "glyphicon-sort";
    }

    searchKnownPersons() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('personManagement-search', this.searchValue);
        this.timer = this.timeout(() => {
            this.state.go('.', {
                search: this.searchValue,
            });
            this.getKnownPersons();
        }, 500);
    }

    getKnownPersons() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.loading = true;
        this.personManagementListService.listKnownPersons(this.getQueryParams(pageNumber))
        .then((promise) => {
            this.knownPersons = promise.data.results;
            for (let idx in this.knownPersons) {
                if (this.knownPersons[idx].form.form_name) {
                    let path = this.knownPersons[idx].form.form_type + '/' + this.knownPersons[idx].form.form_id;
                    let reactParams = new URLSearchParams({
                        countryName: this.knownPersons[idx].form.country_name,
                        stationId: this.knownPersons[idx].form.station_id,
                        countryId: this.knownPersons[idx].form.country_id
                    }).toString();

                    let reactPath = `${path}/view?${reactParams}`;

                    this.knownPersons[idx].viewUrl = this.getReactUrl(reactPath);
                }
            }
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.loading = false;
        });
        
    }

    loadMoreKnownPersons() {
        this.loading = true;
        this.personManagementListService.loadMoreKnownPersons(this.getQueryParams(true))
            .then((promise) => {
                this.knownPersons = this.knownPersons.concat(promise.data.results);
                this.nextPageUrl = this.nextUrl(promise.data.next);
                this.loading = false;
            });
    }

    getQueryParams(pageNumber) {
        var params = [];
        params.push({ "name": "page_size", "value": this.paginate.pageSize });
        params.push({ "name": "page", "value": pageNumber });
        if (this.searchValue) {
            params.push({ "name": "search", "value": this.searchValue });
        }
        if (this.sortColumn) {
            if (this.reverse) {
                params.push({ "name": "ordering", "value": ("-" + this.sortColumn.replace(".", "__")) });
            } else {
                params.push({ "name": "ordering", "value": (this.sortColumn.replace(".", "__")) });
            }
        }
        return params;
    }

    nextUrl(url) {
        if (url) {
            url = url.match(/page=\d+/);
            if (url) {
                url = url[0].match(/\d+/)[0];
            }
        }
        return url;
    }
    
    keyPress(event) {
        if(event.keyCode === 13) {
            this.searchKnownPersons();
        }
    }
    
    masterPerson(knownPerson) {
        let ref =  this.state.href('personManagement', {
            id: knownPerson.master_person
        });
        return ref;
    }
    
    pendingList() {
        return this.state.href('personManagementPendingList');
    }
}

export default personManagementListController;
