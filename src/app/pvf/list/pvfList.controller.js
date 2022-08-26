import createPvfModalTemplate from './createPvfModal.html';

/* global angular */

export default class PvfListController {
    constructor(PvfListService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr, constants, moment) {
        'ngInject';
        this.service = PvfListService;
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
        this.pvfs = [];
        this.nextPage = "";
        this.timeZoneDifference ="+0545";
        this.queryParameters = {
            "page_size": 20,
            "reverse": true,
            "ordering": 'date_time_of_interception',
            "search": '',
            "status": 'approved',
            "country_ids": ''
        };
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        
        this.paginate = {
                items:0,
                pageSize:this.queryParameters.page_size,
                currentPage:1,
            };
        this.countryDropDown = {};
        this.countryDropDown.options = [];
        this.countryDropDown.selectedOptions = [];
        this.countryDropDown.settings = {smartButtonMaxItems:2, showCheckAll: false, showUncheckAll: false,};
        this.countryDropDown.customText = {buttonDefaultText: 'All'};
        this.countryDropDown.eventListener = {
            onItemSelect: this.countryChange,
            onItemDeselect: this.countryChange,
            onSelectAll: this.countryChange,
            onDeselectAll: this.countryChange,
            ctrl: this   
        };
        
        this.status = {};
        this.status.options = [{id: 'approved', label: 'approved'}, {id: 'in-progress', label: 'in-progress'}];
        this.status.selectedOptions = [this.status.options[0]];
        this.status.settings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: false, selectionLimit:1, closeOnSelect: true};
        this.status.customText = {};
        this.status.eventListener = {
            onItemSelect: this.statusChange,
            ctrl: this
        };

        // If there was a search value provided in the url, set it
        let foundStateParams = false;
        if($stateParams) {
            if ($stateParams.search) {
                foundStateParams = true;
                this.queryParameters.search = $stateParams.search;
            }
            if ($stateParams.status) {
                foundStateParams = true;
                this.queryParameters.status = $stateParams.status;
            }
            if ($stateParams.country_ids) {
                foundStateParams = true;
                this.queryParameters.country_ids = $stateParams.country_ids;
            }
        }
        
        if (!foundStateParams) {
            let tmp = sessionStorage.getItem('pvfList-search');
            if (tmp !== null) {
                this.queryParameters.search = tmp;
            }
            tmp = sessionStorage.getItem('pvfList-status');
            if (tmp !== null) {
                this.queryParameters.status = tmp;
            }
            tmp = sessionStorage.getItem('pvfList-country_ids');
            if (tmp !== null) {
                this.queryParameters.country_ids = tmp;
            }
        }
        
        if (this.queryParameters.status === 'in-progress') {
            this.status.selectedOptions = [this.status.options[1]];
        } else {
            this.queryParameters.status = 'approved';
        }

        this.getUserCountries();
        this.getPvfList();
        
        this.getUserStationsForAdd();
    }

    get hasAddPermission() {
        return this.session.checkPermission('PVF','ADD',null, null) === true;
    }

    transform(queryParams, pageNumber) {
        var queryParameters = angular.copy(queryParams);
        if (queryParameters.reverse) {
            queryParameters.ordering = '-' + queryParameters.ordering;
        }
        queryParameters.page = pageNumber;
        delete queryParameters.reverse;
        var params = [];
        Object.keys(queryParameters).forEach( (name) => {
            if (queryParameters[name] !== null && queryParameters[name] !== '') {
                params.push({"name": name, "value": queryParameters[name]});
            }
        });
        return params;
    }
    
    createForm(incident) {
    	this.service.getFormForStation(incident.station).then((response) => {
                if (response.data.length > 0) {
                    this.state.go(response.data[0].form_name, {stationId: incident.station, countryId: incident.country_id, isViewing:false, formName: response.data[0].form_name, incidentId: incident.id});
                } else {
                    this.toastr.error("Unable to find form for station " + station.label);
                }
            });
    }
    
    createPvf() {
        var stationsForAdd = this.stationsForAdd;
        let modalInstance = this.modal.open({
            animation: true,
            templateUrl: createPvfModalTemplate,
            controller: 'CreatePvfModalController as vm',
            size: 'md',
            resolve: {
                stations() {
                    return stationsForAdd;
                }
            }
        });
        modalInstance.result.then((station) => {
            this.service.getFormForStation(station.id).then((response) => {
                if (response.data.length > 0) {
                    this.state.go(response.data[0].form_name, {stationId: station.id, countryId: station.country_id, isViewing:false, formName: response.data[0].form_name});
                } else {
                    this.toastr.error("Unable to find form for station " + station.label);
                }
            });
        });
    }

    searchPvfs() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('pvfList-search', this.queryParameters.search);
        sessionStorage.setItem('pvfList-status', this.queryParameters.status);
        sessionStorage.setItem('pvfList-country_ids', this.queryParameters.country_ids);
        this.timer = this.timeout( () => {
            this.state.go('.', {
                search: this.queryParameters.search, 
                status: this.queryParameters.status,
                country_ids: this.queryParameters.country_ids});
            this.getPvfList(1);
        }, 500);
    }
    
    countryChange() {
        var selectedCountries = '';
        var sep = '';
        var ctrl = this.ctrl;
        for (var idx=0; idx < ctrl.countryDropDown.selectedOptions.length; idx++) {
            selectedCountries = selectedCountries + sep + ctrl.countryDropDown.selectedOptions[idx].id;
            sep = ',';
        }
        ctrl.queryParameters.country_ids = selectedCountries;
        ctrl.searchPvfs();
    }
    
    statusChange() {
        var ctrl = this.ctrl;
        ctrl.queryParameters.status = ctrl.status.selectedOptions[0].id;
        ctrl.searchPvfs();
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
        this.getPvfList();
    }
    
    getUserCountries() {
        this.service.getUserCountries(this.session.user.id).then((promise) => {
            this.countries = promise.data;
            this.countryDropDown.options = [];
            for (var idx=0; idx < this.countries.length; idx++) {
                this.countryDropDown.options.push({id: this.countries[idx].id, label: this.countries[idx].name});
            }
            this.getUserStationsForAdd();
            
            if (this.queryParameters.country_ids.length > 0) {
                let country_array = this.queryParameters.country_ids.split(',');
                for (let idx=0; idx < country_array.length; idx++) {
                    let country_id = Number(country_array[idx]);
                    for (let idx1=0; idx1 < this.countries.length; idx1++) {
                        if (this.countries[idx1].id === country_id) {
                            this.countryDropDown.selectedOptions.push(this.countryDropDown.options[idx1]);
                        }
                    }
                    
                }
            }
        });
    }
    
    getUserStationsForAdd() {
        this.service.getUserStationsForAdd(this.session.user.id).then((promise) => {
            this.stationsForAdd = promise.data;
            for (let idx=0; idx < this.stationsForAdd.length; idx++) {
                for (let idx2=0; idx2 < this.countries.length; idx2++) {
                    if (this.stationsForAdd[idx].operating_country === this.countries[idx2].id) {
                        this.stationsForAdd[idx].country_name = this.countries[idx2].name;
                        this.stationsForAdd[idx].country_id = this.countries[idx2].id;
                    }
                }
            }
        });
    }
    
    addUrls(pvfs) {
        for (let idx=0; idx < pvfs.length; idx++) {
            let pvf = pvfs[idx];
            if (pvf.form_name !== null) {
                pvf.viewUrl = this.state.href(pvfs[idx].form_name, {id:pvf.id, stationId:pvf.station.id, countryId:pvf.station.operating_country.id, isViewing:true,formName: pvfs[idx].form_name});
                pvf.editUrl = this.state.href(pvfs[idx].form_name, {id:pvf.id, stationId:pvf.station.id, countryId:pvf.station.operating_country.id, isViewing:false, formName: pvfs[idx].form_name});
            }
            pvf.relatedUrl = this.state.href('relatedForms', {stationId: pvf.station.id, formNumber: pvf.pvf_number});
        }
    }

    getPvfList() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for PVFs...");        
        this.service.getPvfList(this.transform(this.queryParameters, pageNumber)).then( (promise) => {
            this.pvfs = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
            this.addUrls(this.pvfs);
        });
    }

    deletePvf(pvf, index) {
        if (pvf.confirmedDelete) {
            this.service.deletePvf(pvf.station.id, pvf.id).then(
                () => {
                    this.toastr.success("Successfully Deleted PVF!");
                    this.pvfs.splice(index, 1);
                },
                () => {
                    this.toastr.error("Unable to Delete PVF!");
                }
            );
        }
        else {
            pvf.confirmedDelete = true;
        }
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
        return `pvf-all-data-${date}.csv`;
    }
    
    createIncidentForm(incident) {
    	alert(incident);
    }
}
