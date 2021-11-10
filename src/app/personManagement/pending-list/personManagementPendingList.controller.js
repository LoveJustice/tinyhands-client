import "./personManagementPendingList.less";
import {BaseMasterPersonCompare} from '../baseMasterPersonCompare.js';
import MatchModalController from '../matchModal.controller';
import matchTemplate from '../step-templates/matchModal.html';

class personManagementPendingListController extends BaseMasterPersonCompare {
    constructor(StickyHeader, $rootScope, $scope, $http, $timeout, personManagementPendingListService, personManagementService, SessionService, $uibModal, $state, $stateParams, $document, toastr, constants) {
        'ngInject';

        super(personManagementService, $stateParams);
        this.state = $state;
        this.sticky = StickyHeader;
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.$uibModal = $uibModal;
        this.http = $http;
        this.timeout = $timeout;
        this.personManagementPendingListService = personManagementPendingListService;
        this.personManagementService = personManagementService;
        this.session = SessionService;
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
        this.countryId = "";
        this.matchType="";
        this.matchRole="";
        
        let tmp = sessionStorage.getItem('personManagement-search');
        if (tmp !== null) {
            this.searchValue = tmp;
        }
        tmp = sessionStorage.getItem('personManagement-country');
        if (tmp !== null) {
            this.countryId = tmp;
        }
        tmp = sessionStorage.getItem('personManagement-match');
        if (tmp !== null) {
            this.matchType = tmp;
        }
        
        this.getCountries();
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

    searchPendingMatches() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('personManagement-search', this.searchValue);
        if (this.countryId !== '') {
            sessionStorage.setItem('personManagement-country', this.countryId);
        } else {
            sessionStorage.removeItem('personManagement-country');
        }
        if (this.matchType !== '') {
            sessionStorage.setItem('personManagement-match', this.matchType);
        } else {
            sessionStorage.removeItem('personManagement-match');
        }
        this.timer = this.timeout(() => {
            this.state.go('.', {
                search: this.searchValue,
            });
            this.getPendingMatches();
        }, 500);
    }
    
    getCountries() {
        this.personManagementPendingListService.getUserCountries(this.session.user.id).then(promise => {
            this.countries = promise.data;
            this.getPendingMatches();
        });
    }

    getPendingMatches() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.loading = true;
        this.personManagementPendingListService.listPendingMatches(this.getQueryParams(pageNumber))
            .then((promise) => {
                this.pendingMatches = promise.data.results;
                this.paginate.items = promise.data.count;
                this.paginate.currentPage = pageNumber;
                this.loading = false;
            }); 
    }

    loadMorePendingMatches() {
        this.loading = true;
        this.personManagementPendingListService.loadMorePendingMatches(this.getQueryParams(true))
            .then((promise) => {
                this.pendingMatches = this.pendingMatches.concat(promise.data.results);
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
        if (this.countryId) {
            params.push({"name": "country", "value": this.countryId});
        }
        if (this.matchType) {
            params.push({"name": "match", "value": this.matchType});
        }
        if (this.matchRole) {
            params.push({"name": "role", "value": this.matchRole});
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
            this.searchPendingMatches();
        }
    }
    
    compare(pendingMatch) {
        this.match = [null, null];
        this.getPvRelations(pendingMatch.master1_id, 0, pendingMatch);
        this.getPvRelations(pendingMatch.master2_id, 1, pendingMatch);
    }
    
    getPvRelations(id, position, pendingMatch) {
        this.service.getPvRelations(id).then((response) => {
            let details = {
                pvRelations:response.data
            }
            this.getMasterPerson(id, position, pendingMatch, details);
        });
    }
    
    getMasterPerson(id, position, pendingMatch, details) {
        this.personManagementService.getMasterPerson(id).then((promise) => {
            let matchData = {
                    masterPerson:promise.data,
                    details:details
            };
            this.preProcess(matchData.masterPerson, matchData.details);
            this.match[position] = matchData;
            this.compareMasterPersons(pendingMatch);
        });
    }
    
    compareMasterPersons(pendingMatch) {
        if (this.match[0] === null || this.match[1] === null) {
            return;
        }
        let matchObj = {
            id:pendingMatch.match_id,
            match_date:pendingMatch.match_date,
            matched_by:pendingMatch.matched_by,
            notes:pendingMatch.notes,

            master_person:this.match[1].masterPerson,
            notes:pendingMatch.notes
        };
        let match_str = pendingMatch.match.toLowerCase();
        if (match_str === 'non-match') {
            match_str = 'non';
        }
        this.modalActions = {};
        this.$uibModal.open({
            bindToController: true,
            controller: MatchModalController,
            controllerAs: 'vm',
            resolve: {
                main: () => this.match[0].masterPerson,
                mainDetails:() => this.match[0].details,
                compare: () => matchObj,
                compareDetails: () => this.match[1].details,
                modalActions: () => this.modalActions,
                where: () => match_str,
                constants: () => this.constants,
                phoneTypes: () => this.phoneTypes,
                addressTypes: () => this.addressTypes,
                socialMediaTypes: () => this.socialMediaTypes,
                possibleMatchType: () => this.possibleMatchType,
                nonMatchType: () => this.nonMatchType,
                detailsModified: () => false,
            },
            size: 'lg',
            templateUrl: matchTemplate,
            windowClass: 'match-modal-popup',
        }).result.then(() => {
            if (this.modalActions.action === 'update') {
                this.modalActions.master1 = this.match[0].masterPerson.id;
                this.modalActions.master2 = matchObj.master_person.id;
                this.personManagementService.updateMatch(pendingMatch.match_id, this.modalActions.match_type, this.modalActions).then(() => {
                    this.searchPendingMatches();
                });
            } else if (this.modalActions.action === 'merge') {
                this.personManagementService.merge(this.match[0].masterPerson.id, matchObj.master_person.id, this.modalActions).then(() => {
                    this.searchPendingMatches();
                }, (error) => {
                    this.toastr.error(error.data.errors);
                    });
            }
        });
    }
    
    masterPersonLink(masterId) {
        let ref =  this.state.href('personManagement', {
            id: masterId
        });
        return ref;
    }
    
    
}

export default personManagementPendingListController;
