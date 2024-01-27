import './personManagementPendingList.less';

class personManagementPendingFaceMatchesListController {
    constructor(
        StickyHeader,
        $rootScope,
        $scope,
        $http,
        $timeout,
        personManagementPendingFaceMatchesListService,
        personManagementService,
        SessionService,
        $uibModal,
        $state,
        $stateParams,
        $document,
        toastr,
        constants
    ) {
        'ngInject';

        this.state = $state;
        this.sticky = StickyHeader;
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.$uibModal = $uibModal;
        this.http = $http;
        this.timeout = $timeout;
        this.personManagementPendingFaceMatchesListService = personManagementPendingFaceMatchesListService;
        this.personManagementService = personManagementService;
        this.session = SessionService;
        this.modal = $uibModal;
        this.toastr = toastr;
        this.constants = constants;

        this.loading = false;
        this.reverse = false;
        this.paginateBy = 25;
        this.knownPersons = [];
        this.searchValue = '';
        this.nextPageUrl = '';
        this.sortColumn = '';
        this.stickyOptions = this.sticky.stickyOptions;
        this.timer = {};
        this.addSearchValue = '';

        this.paginate = {
            items: 0,
            pageSize: this.paginateBy,
            currentPage: 1,
        };

        this.showIdMgmt = true;
        this.showAddAlias = false;
        this.showRemoveAlias = false;
        this.isViewing = false;
        this.countryId = '';
        this.matchType = '';
        this.matchRole = '';

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

        this.getEncodedPersons();

    }

    sortIcon(column) {
        if (column === this.sortColumn) {
            switch (column) {
                case 'age':
                case 'phone':
                    return this.reverse ? 'glyphicon-sort-by-order-alt' : 'glyphicon-sort-by-order';
                case 'name':
                case 'gender':
                case 'address1':
                case 'address2':
                    return this.reverse ? 'glyphicon-sort-by-alphabet-alt' : 'glyphicon-sort-by-alphabet';
                default:
                    return 'glyphicon-sort';
            }
        }
        return 'glyphicon-sort';
    }

    // TODO
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

    // TODO
    getCountries() {
        this.personManagementPendingFaceMatchesListService.getUserCountries(this.session.user.id).then((promise) => {
            this.countries = promise.data;
            this.getEncodedPersons();
        });
    }

    // TODO: compare
    // getFaceEncoding(person_id) {
    //     this.personManagementPendingFaceMatchesListService.getFaceEncoding(person_id).then((promise) => {
    //         this.compare(promise.data);
    //     });
    // }

    getEncodedPersons() {
        this.showPage(1);
    }

    showPage(pageNumber) {
        this.loading = true;
        this.personManagementPendingFaceMatchesListService.listFaceEncodings(this.getQueryParams(pageNumber)).then((promise) => {
            this.encodedPersons = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.loading = false;
        });
    }

    loadMoreEncodedPersons() {
        this.loading = true;
        this.personManagementPendingFaceMatchesListService.loadMoreEncodedPersons(this.getQueryParams(true)).then((promise) => {
            this.encodedPersons = this.encodedPersons.concat(promise.data.results);
            this.nextPageUrl = this.nextUrl(promise.data.next);
            this.loading = false;
        });
    }

    getQueryParams(pageNumber) {
        var params = [];
        params.push({ name: 'page_size', value: this.paginate.pageSize });
        params.push({ name: 'page', value: pageNumber });
        if (this.searchValue) {
            params.push({ name: 'search', value: this.searchValue });
        }
        if (this.sortColumn) {
            if (this.reverse) {
                params.push({ name: 'ordering', value: '-' + this.sortColumn.replace('.', '__') });
            } else {
                params.push({ name: 'ordering', value: this.sortColumn.replace('.', '__') });
            }
        }
        if (this.countryId) {
            params.push({ name: 'country', value: this.countryId });
        }
        if (this.matchType) {
            params.push({ name: 'match', value: this.matchType });
        }
        if (this.matchRole) {
            params.push({ name: 'role', value: this.matchRole });
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
        if (event.keyCode === 13) {
            this.searchPendingMatches();
        }
    }
}

export default personManagementPendingFaceMatchesListController;
