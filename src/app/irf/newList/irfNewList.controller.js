import createIrfModalTemplate from './createIrfModal.html';
import attachmentExportModalTemplate from './attachmentExportModal.html'

/* global angular */

export default class IrfNewListController {
    constructor(IrfNewListService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout, toastr, constants, moment) {
        'ngInject';
        this.service = IrfNewListService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.modal = $uibModal;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.toastr = toastr;
        this.constants = constants;
        this.moment = moment;
        this.countries = [];
        this.stationsForAdd = [];

        this.timer = {};
        this.searchTimer = null;
        this.irfs = [];
        this.nextPage = '';
        this.timeZoneDifference = '+0545';
        this.queryParameters = {
            page_size: 20,
            reverse: true,
            ordering: 'date_of_interception,time_of_interception',
            search: '',
            status: '!invalid',
            country_ids: '',
        };
        
        this.paginate = {
            items:0,
            pageSize:this.queryParameters.page_size,
            currentPage:1,
        };
        
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;

        this.countryDropDown = {};
        this.countryDropDown.options = [];
        this.countryDropDown.selectedOptions = [];
        this.countryDropDown.settings = {
            smartButtonMaxItems: 2,
            showCheckAll: false,
            showUncheckAll: false,
        };
        this.countryDropDown.customText = { buttonDefaultText: 'All' };
        this.countryDropDown.eventListener = {
            onItemSelect: this.countryChange,
            onItemDeselect: this.countryChange,
            onSelectAll: this.countryChange,
            onDeselectAll: this.countryChange,
            ctrl: this,
        };
        this.queryParameters.date_filter = 'None';
        this.date_end = new Date();
        this.date_start = new Date();
        this.date_start.setUTCDate(1);

        this.oldIndex = 3;
        this.status = {};
        this.status.options = [ {id: '!invalid', label: 'all valid', group:'z'},
            { id: 'in-progress', label: 'in-progress', group:'Status' }, 
            { id: 'approved,!None', label: 'submitted with evidence category', group:'Status' },
            { id: 'approved,None', label: 'old - submitted without evidence category', group:'Status'},
            { id: 'first-verification', label: 'first-verification', group:'Status' },
            { id: 'second-verification', label: 'second-verification', group:'Status'},
            { id: 'second-verification,Clear', label: 'clear evidence', group:'Final Verification Evidence Category'},
            { id: 'second-verification,Some', label: 'some evidence', group:'Final Verification Evidence Category'},
            { id: 'second-verification,High', label: 'high risk', group:'Final Verification Evidence Category'},
            { id: 'invalid', label: 'invalid', group:'Final Verification Evidence Category' }];
        this.status.selectedOptions = [this.status.options[0]];
        this.status.settings = {
            smartButtonMaxItems: 1,
            showCheckAll: false,
            showUncheckAll: false,
            selectionLimit:1,
            groupByTextProvider(groupValue) { if (groupValue ==='z') {return '';} else {return groupValue;} },
            groupBy:'group', 
            closeOnSelect: true,
        };
        this.status.customText = {};
        this.status.eventListener = {
            onItemSelect: this.statusChange,
            onItemDeselect: this.statusChange,
            ctrl: this,
        };

        // If there was a search value provided in the url, set it
        let foundStateParams = false;
        if ($stateParams) {
            if ($stateParams.search) {
                foundStateParams = true;
                this.queryParameters.search = $stateParams.search;
            }
            if ($stateParams.country_ids) {
                foundStateParams = true;
                this.queryParameters.country_ids = $stateParams.country_ids;
            }
            if ($stateParams.status) {
                foundStateParams = true;
                this.queryParameters.status = $stateParams.status;
            }
        }
        
        if (!foundStateParams) {
            let tmp = sessionStorage.getItem('irfList-search');
            if (tmp !== null) {
                this.queryParameters.search = tmp;
            }
            tmp = sessionStorage.getItem('irfList-status');
            if (tmp !== null) {
                this.queryParameters.status = tmp;
            }
            tmp = sessionStorage.getItem('irfList-country_ids');
            if (tmp !== null) {
                this.queryParameters.country_ids = tmp;
            }
        }
        
        let tmp = sessionStorage.getItem('irfList-date_filter');
        if (tmp !== null) {
            this.queryParameters.date_filter = tmp;
        }
        tmp = sessionStorage.getItem('irfList-date_start');
        if (tmp !== null) {
            this.date_start = new Date(tmp);
        }
        tmp = sessionStorage.getItem('irfList-date_end');
        if (tmp !== null) {
            this.date_end = new Date(tmp);
        }
        
        sessionStorage.setItem('irfList-date_filter', this.queryParameters.date_filter);
        sessionStorage.setItem('irfList-date_start', this.date_start);
        sessionStorage.setItem('irfList-date_end', this.date_end);
        
        if (this.queryParameters.status !== '') {
            this.status.selectedOptions = [];
            for (let optionIdx in this.status.options) {
                if (this.queryParameters.status === this.status.options[optionIdx].id) {
                    this.status.selectedOptions.push(this.status.options[optionIdx]);
                    break;
                }
            }
        }
        
        this.getUserCountries();
        this.searchIrfs();

        this.getUserStationsForAdd();
    }

    get hasAddPermission() {
        return this.session.checkPermission('IRF', 'ADD', null, null) === true;
    }

    transform(queryParameters, pageNumber) {
        var queryParams = angular.copy(queryParameters);
        if (queryParams.reverse) {
            let parts = queryParams.ordering.split(',');
            queryParams.ordering = "";
            for (let idx=0; idx < parts.length; idx++) {
                if (queryParams.ordering.length > 0) {
                    queryParams.ordering += ',';
                }
                queryParams.ordering += '-' + parts[idx];
            }
        }
        queryParams.page = pageNumber;
        delete queryParams.reverse;
        var params = [];
        Object.keys(queryParams).forEach(name => {
            if (queryParams[name] !== null && queryParams[name] !== '') {
                params.push({ name: name, value: queryParams[name] });
            }
        });
        return params;
    }

    extractPage(url) {
        try {
            return url
                .slice(url.indexOf('page='))
                .split('&')[0]
                .split('=')[1];
        } catch (e) {
            return 0;
        }
    }

    createIrf() {
        var stationsForAdd = this.stationsForAdd;
        let modalInstance = this.modal.open({
            animation: true,
            templateUrl: createIrfModalTemplate,
            controller: 'CreateIrfModalController as vm',
            size: 'md',
            resolve: {
                stations() {
                    return stationsForAdd;
                },
            },
        });
        modalInstance.result.then(station => {
            this.service.getFormForStation(station.id).then(response => {
                if (response.data.length > 0) {
                    this.state.go(response.data[0].form_name, {
                        stationId: station.id,
                        countryId: station.country_id,
                        isViewing: false,
                        formName: response.data[0].form_name,
                    });
                } else {
                    this.toastr.error('Unable to find form for station ' + station.label);
                }
            });
        });
    }
    
    dateAsString(inDate) {
        let dateString = '';
        dateString = inDate.getUTCFullYear() + '-';
        if (inDate.getUTCMonth() < 9) {
            dateString += '0';
        }
        dateString += (inDate.getUTCMonth()+1) + "-";
        if (inDate.getUTCDate() <= 9) {
            dateString += '0';
        }
        dateString += inDate.getUTCDate();
        return dateString;
    }

    searchIrfs() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        
        
        sessionStorage.setItem('irfList-search', this.queryParameters.search);
        sessionStorage.setItem('irfList-status', this.queryParameters.status);
        sessionStorage.setItem('irfList-country_ids', this.queryParameters.country_ids);
        sessionStorage.setItem('irfList-date_filter', this.queryParameters.date_filter);
        sessionStorage.setItem('irfList-date_start', this.date_start);
        sessionStorage.setItem('irfList-date_end', this.date_end);
        
        this.queryParameters.date_start = this.dateAsString(this.date_start);
        this.queryParameters.date_end = this.dateAsString(this.date_end);
        this.timer = this.timeout(() => {
            this.state.go('.', {
                search: this.queryParameters.search,
                status: this.queryParameters.status,
                country_ids: this.queryParameters.country_ids,
            });
            this.getIrfList();
        }, 500);
    }
    
    setSearchTimer() {
        if (this.searchTimer) {
            this.timeout.cancel(this.searchTimer);
        }
        
        this.searchTimer = this.timeout(() => {this.searchTimerExpired();}, 1500);
    }

    countryChange() {
        this.ctrl.setSearchTimer();
    }

    statusChange() {
        this.ctrl.searchTimerExpired();
    }
    
    searchTimerExpired() {
        this.searchTimer = null;
        
        var selectedCountries = '';
        var sep = '';
        for (var idx = 0; idx < this.countryDropDown.selectedOptions.length; idx++) {
            selectedCountries = selectedCountries + sep + this.countryDropDown.selectedOptions[idx].id;
            sep = ',';
        }
        
        var selectedStatus = '';
        if (this.status.selectedOptions.length > 0) {
            selectedStatus = this.status.selectedOptions[0].id;
        }
        
        if (this.queryParameters.country_ids !== selectedCountries || this.queryParameters.status !== selectedStatus) {
            this.queryParameters.country_ids = selectedCountries;
            this.queryParameters.status = selectedStatus;
            this.searchIrfs(); 
        }
    }

    getSortIcon(column, reverse) {
        if (reverse === 'reverse') {
            return column === this.queryParameters.ordering && this.queryParameters.reverse;
        }
        return column === this.queryParameters.ordering && !this.queryParameters.reverse;
    }

    updateSort(column) {
        if (column === this.queryParameters.ordering) {
            this.queryParameters.reverse = !this.queryParameters.reverse;
        }
        this.queryParameters.ordering = column;
        this.getIrfList();
    }

    getUserCountries() {
        let keepOldList = ['Nepal', 'Bangladesh', 'India'];
        let keepOld = false;
        this.service.getUserCountries(this.session.user.id).then(promise => {
            this.countries = promise.data;
            this.countryDropDown.options = [];
            for (var idx = 0; idx < this.countries.length; idx++) {
                this.countryDropDown.options.push({
                    id: this.countries[idx].id,
                    label: this.countries[idx].name,
                });
                if (keepOldList.indexOf(this.countries[idx].name) > -1) {
                    keepOld = true;
                }
            }
            this.getUserStationsForAdd();

            if (this.queryParameters.country_ids.length > 0) {
                let country_array = this.queryParameters.country_ids.split(',');
                for (let idx = 0; idx < country_array.length; idx++) {
                    let country_id = Number(country_array[idx]);
                    for (let idx1 = 0; idx1 < this.countries.length; idx1++) {
                        if (this.countries[idx1].id === country_id) {
                            this.countryDropDown.selectedOptions.push(this.countryDropDown.options[idx1]);
                        }
                    }
                }
            }
            
            if (!keepOld && this.status.options[this.oldIndex].label.startsWith('old')) {
                this.status.options.splice(this.oldIndex, 1);
            }

        });
    }

    getUserStationsForAdd() {
        this.service.getUserStationsForAdd(this.session.user.id).then(promise => {
            this.stationsForAdd = promise.data;
            for (let idx = 0; idx < this.stationsForAdd.length; idx++) {
                for (let idx2 = 0; idx2 < this.countries.length; idx2++) {
                    if (this.stationsForAdd[idx].operating_country === this.countries[idx2].id) {
                        this.stationsForAdd[idx].country_name = this.countries[idx2].name;
                        this.stationsForAdd[idx].country_id = this.countries[idx2].id;
                    }
                }
            }
        });
    }

    addUrls(irfs) {
        for (let idx = 0; idx < irfs.length; idx++) {
            let irf = irfs[idx];
            if (irf.form_name !== null) {
                irf.viewUrl = this.state.href(irfs[idx].form_name, {
                    id: irf.id,
                    stationId: irf.station.id,
                    countryId: irf.station.operating_country.id,
                    isViewing: true,
                    formName: irfs[idx].form_name,
                });
                irf.editUrl = this.state.href(irfs[idx].form_name, {
                    id: irf.id,
                    stationId: irf.station.id,
                    countryId: irf.station.operating_country.id,
                    isViewing: false,
                    formName: irfs[idx].form_name,
                });
            }
            irf.relatedUrl = this.state.href('relatedForms', {
                stationId: irf.station.id,
                formNumber: irf.irf_number
            });
        }
    }

    getIrfList() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for IRFs...");        
        this.service.getIrfList(this.transform(this.queryParameters, pageNumber)).then( (promise) => {
            this.irfs = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
            this.addUrls(this.irfs);
        });
    }

    deleteIrf(irf, index) {
        if (irf.confirmedDelete) {
            this.service.deleteIrf(irf.station.id, irf.id).then(
                () => {
                    this.toastr.success('Successfully Deleted IRF!');
                    this.irfs.splice(index, 1);
                },
                () => {
                    this.toastr.error('Unable to Delete IRF!');
                }
            );
        } else {
            irf.confirmedDelete = true;
        }
    }

    exportCsv() {
        this.spinnerOverlayService.show('Exporting to CSV');
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
    
    attachmentExport() {
        this.modal.open({
            animation: true,
            templateUrl: attachmentExportModalTemplate,
            controller: 'AttachmentExportModalController as vm',
            size: 'lg'
        });
    }
}
