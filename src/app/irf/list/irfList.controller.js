import NewIrfModalController from './newIrfModal/newIrfModal.controller.js';
import newIrfModalTemplate from './newIrfModal/newIrfModal.html';
export default class IrfListController {
    constructor($uibModal, IrfListService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $timeout, toastr, constants, moment) {
        'ngInject';
        this.$uibModal = $uibModal;
        this.service = IrfListService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.toastr = toastr;
        this.constants = constants;
        this.moment = moment;

        this.timer = {};
        this.irfs = [];
        this.nextPage = "";
        this.timeZoneDifference = "+0545";
        this.queryParameters = {
            "page_size": 25,
            "reverse": true,
            "ordering": 'date_time_of_interception',
            "search": ''
        };
        this.stickyOptions = this.sticky.stickyOptions;

        if ($stateParams) {
            this.queryParameters.search = $stateParams.search;
        }
        this.getIrfList();

        this.checkForExistingIrfs();
    }

    get hasAddPermission() {
        return this.session.user.permission_irf_add === true;
    }

    get hasDeletePermission() {
        return this.session.user.permission_irf_delete === true;
    }

    get hasEditPermission() {
        return this.session.user.permission_irf_edit === true;
    }

    get hasViewPermission() {
        return this.session.user.permission_irf_view === true;
    }

    openNewIrfModal() {
        this.$uibModal.open({
            bindToController: true,
            controller: NewIrfModalController,
            controllerAs: 'NewIrfModalController',
            size: 'md',
            templateUrl: newIrfModalTemplate
        });
    }

    transform(queryParams) {
        var queryParameters = angular.copy(queryParams);
        if (queryParameters.reverse) {
            queryParameters.ordering = '-' + queryParameters.ordering;
        }
        delete queryParameters.reverse;
        var params = [];
        Object.keys(queryParameters).forEach((name) => {
            params.push({
                "name": name,
                "value": queryParameters[name]
            });
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
        this.timer = this.timeout(() => {
            this.state.go('.', {
                search: this.queryParameters.search
            });
            this.getIrfList();
        }, 500);
    }

    getSortIcon(column, reverse) {
        if (reverse === 'reverse') {
            return (column === this.queryParameters.ordering) && this.queryParameters.reverse;
        }
        return (column === this.queryParameters.ordering) && !this.queryParameters.reverse;
    }

    updateSort(column) {
        if (column === this.queryParameters.ordering) {
            this.queryParameters.reverse = !this.queryParameters.reverse;
        }
        this.queryParameters.ordering = column;
        this.getIrfList();
    }

    getIrfList() {
        this.spinnerOverlayService.show("Searching for IRFs...");
        this.service.getIrfList(this.transform(this.queryParameters)).then((promise) => {
            this.irfs = promise.data.results;
            this.nextPage = this.extractPage(promise.data.next);
            this.spinnerOverlayService.hide();
        });
    }

    showMoreIrfs() {
        let params = angular.copy(this.queryParameters);
        params.page = this.nextPage;
        this.service.getMoreIrfs(this.transform(params)).then((promise) => {
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
        } else {
            irf.confirmedDelete = true;
        }
    }

    checkForExistingIrfs() {
        let savedForLaterIrfs = this.getSaveForLaterObject();
        if (savedForLaterIrfs === null) {
            return;
        }

        savedForLaterIrfs = Object.keys(savedForLaterIrfs);
        savedForLaterIrfs.forEach((irfNumber) => {
            this.service.irfExists(irfNumber).then((promise) => {
                if (promise.data === irfNumber) {
                    this.removeIrfFromSaveForLater(irfNumber);
                }
            });
        });
    }

    removeIrfFromSaveForLater(irfNumber) {
        var obj = this.getSaveForLaterObject();
        delete obj[irfNumber];
        localStorage.setItem('saved-irfs', JSON.stringify(obj));
    }

    getSaveForLaterObject() {
        return JSON.parse(localStorage.getItem('saved-irfs'));
    }

    exportCsv() {
        this.spinnerOverlayService.show("Exporting to CSV");
        return this.service.getCsvExport();
    }

    onExportComplete() {
        this.spinnerOverlayService.hide();
    }

    onExportError() {
        this.toastr.error('An error occurred while exporting');
        this.spinnerOverlayService.hide();
    }

    getExportFileName() {
        let date = this.moment().format('Y-M-D');
        return `irf-all-data-${date}.csv`;
    }
}