/* global angular */
/* global Image */
class personManagementListController {
    constructor(StickyHeader, $rootScope, $scope, $http, $timeout, personManagementListService, $uibModal, $state, $stateParams, $document, toastr, constants) {
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
        this.loading = true;
        this.personManagementListService.listKnownPersons(this.getQueryParams())
            .then((promise) => {
                this.knownPersons = promise.data.results;
                for (let idx in this.knownPersons) {
                    if (this.knownPersons[idx].form_name) {
                        this.knownPersons[idx].viewUrl = this.state.href(this.knownPersons[idx].form_name, {id:this.knownPersons[idx].form_id, 
                            stationId:this.knownPersons[idx].station_id, countryId:this.knownPersons[idx].country_id, isViewing:true,
                            formName:this.knownPersons[idx].form_name});
                    }
                }
                this.nextPageUrl = this.nextUrl(promise.data.next);
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

    getQueryParams(loadMore = false) {
        var params = [];
        params.push({ "name": "page_size", "value": this.paginateBy });
        if (this.nextPageUrl && loadMore) {
            params.push({ "name": "page", "value": this.nextPageUrl });
        }
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
            id: knownPerson.alias_group
        });
        return ref;
    }
}

export default personManagementListController;
