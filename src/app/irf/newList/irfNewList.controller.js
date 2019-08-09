import createIrfModalTemplate from './createIrfModal.html';

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
            page_size: 25,
            reverse: true,
            ordering: 'date_time_of_interception',
            search: '',
            status: 'in-progress,A-CE,A-SE,A-HR,1V-CE,1V-SE,1V-HR,1V-SNHI,2V-CE,2V-SE,2V-HR',
            country_ids: '',
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

        this.status = {};
        this.status.options = [{ id: 'in-progress', label: 'in-progress' }, 
            { id: 'A-CE', label: 'A-CE' }, { id: 'A-SE', label: 'A-SE' }, { id: 'A-HR', label: 'A-HR' },
            { id: '1V-CE', label: '1V-CE' }, { id: '1V-SE', label: '1V-SE' }, { id: '1V-HR', label: '1V-HR' }, { id: '1V-SNHI', label: '1V-SNHI' },
            { id: '2V-CE', label: '2V-CE' }, { id: '2V-SE', label: '2V-SE' }, { id: '2V-HR', label: '2V-HR' }, { id: '2V-SNHI', label: '2V-SNHI' }];
        this.status.selectedOptions = [this.status.options[0], this.status.options[1], this.status.options[2], this.status.options[3],
            this.status.options[4], this.status.options[5], this.status.options[6], this.status.options[7],
            this.status.options[8], this.status.options[9], this.status.options[10]];
        this.status.settings = {
            smartButtonMaxItems: 2,
            showCheckAll: false,
            showUncheckAll: false,
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
        
        if (this.queryParameters.status !== '') {
            let statusList = this.queryParameters.status.split(',');
            this.status.selectedOptions = [];
            for (let statusIdx in statusList) {
                for (let optionIdx in this.status.options) {
                    if (statusList[statusIdx] === this.status.options[optionIdx].id) {
                        this.status.selectedOptions.push(this.status.options[optionIdx]);
                    }
                }
            }
        }
        

        this.getUserCountries();
        this.getIrfList();

        this.getUserStationsForAdd();
    }

    get hasAddPermission() {
        return this.session.checkPermission('IRF', 'ADD', null, null) === true;
    }

    transform(queryParams) {
        var queryParameters = angular.copy(queryParams);
        if (queryParameters.reverse) {
            queryParameters.ordering = '-' + queryParameters.ordering;
        }
        delete queryParameters.reverse;
        var params = [];
        Object.keys(queryParameters).forEach(name => {
            if (queryParameters[name] !== null && queryParameters[name] !== '') {
                params.push({ name: name, value: queryParameters[name] });
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

    searchIrfs() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('irfList-search', this.queryParameters.search);
        sessionStorage.setItem('irfList-status', this.queryParameters.status);
        sessionStorage.setItem('irfList-country_ids', this.queryParameters.country_ids);
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
        this.ctrl.setSearchTimer();
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
        for (let optionIdx in this.status.selectedOptions){
            selectedStatus += sep + this.status.selectedOptions[optionIdx].id;
            sep = ',';
        }
        
        if (this.queryParameters.country_ids !== selectedCountries || this.queryParameters.status !== selectedStatus) {
            this.queryParameters.country_ids = selectedCountries;
            this.queryParameters.status = selectedStatus
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
        this.service.getUserCountries(this.session.user.id).then(promise => {
            this.countries = promise.data;
            this.countryDropDown.options = [];
            for (var idx = 0; idx < this.countries.length; idx++) {
                this.countryDropDown.options.push({
                    id: this.countries[idx].id,
                    label: this.countries[idx].name,
                });
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
        }
    }

    getIrfList() {
        this.spinnerOverlayService.show('Searching for IRFs...');
        this.service.getIrfList(this.transform(this.queryParameters)).then(promise => {
            this.irfs = promise.data.results;
            this.addUrls(this.irfs);
            this.nextPage = this.extractPage(promise.data.next);
            this.spinnerOverlayService.hide();
        });
    }

    showMoreIrfs() {
        let params = angular.copy(this.queryParameters);
        params.page = this.nextPage;
        this.service.getMoreIrfs(this.transform(params)).then(promise => {
            this.irfs = this.irfs.concat(promise.data.results);
            this.addUrls(this.irfs);
            this.nextPage = this.extractPage(promise.data.next);
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
}
