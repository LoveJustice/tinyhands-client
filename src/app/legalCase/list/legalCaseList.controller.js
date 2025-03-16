import createLegalCaseModalTemplate from './createLegalCaseModal.html';

/* global angular */

export default class LegalCaseListController {
    constructor(LegalCaseListService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr, constants, moment) {
        'ngInject';
        this.service = LegalCaseListService;
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
        this.legalCases = [];
        this.nextPage = "";
        this.timeZoneDifference ="+0545";
        this.queryParameters = {
            "page_size": 20,
            "reverse": false,
            "ordering": 'incident__incident_number',
            "search": '',
            "status": 'active',
            "country_ids": ''
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
        this.status.options = [{id: 'active', label: 'active'}, {id: 'closed', label: 'closed'},{id: 'active,closed', label: 'All'}];
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
                for (let optionIdx in this.status.options) {
                    if (this.queryParameters.status === this.status.options[optionIdx].id) {
                        this.status.selectedOptions = [];
                        this.status.selectedOptions.push(this.status.options[optionIdx]);
                        break;
                    }
                }
            }
            if ($stateParams.country_ids) {
                foundStateParams = true;
                this.queryParameters.country_ids = $stateParams.country_ids;
            }
        }
        
        if (!foundStateParams) {
            let tmp = sessionStorage.getItem('legalCaseList-search');
            if (tmp !== null) {
                this.queryParameters.search = tmp;
            }
            tmp = sessionStorage.getItem('legalCaseList-status');
            if (tmp !== null) {
                this.queryParameters.status = tmp;
                for (let optionIdx in this.status.options) {
                    if (this.queryParameters.status === this.status.options[optionIdx].id) {
                        this.status.selectedOptions = [];
                        this.status.selectedOptions.push(this.status.options[optionIdx]);
                        break;
                    }
                }
            }
            tmp = sessionStorage.getItem('legalCaseList-country_ids');
            if (tmp !== null) {
                this.queryParameters.country_ids = tmp;
            }
        }
        
        this.getUserCountries();
        this.showPage(1);
        
        this.getUserStationsForAdd();
    }

    get hasAddPermission() {
        return this.session.checkPermission('LEGAL_CASE','ADD',null, null) === true;
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

    extractPage(url) {
        try {
            return url.slice(url.indexOf('page=')).split('&')[0].split('=')[1];
        } catch (e) {
            return 0;
        }
    }
    
    createLegalCase() {
        var stationsForAdd = this.stationsForAdd;
        let modalInstance = this.modal.open({
            animation: true,
            templateUrl: createLegalCaseModalTemplate,
            controller: 'CreateLegalCaseModalController as vm',
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
    
    createForm(incident) {
    	this.service.getFormForStation(incident.station).then((response) => {
                if (response.data.length > 0) {
                    this.state.go(response.data[0].form_name, {stationId: incident.station, countryId: incident.country_id, isViewing:false, formName: response.data[0].form_name, incidentId: incident.id});
                } else {
                    this.toastr.error("Unable to find form for station " + incident.station);
                }
            });
    }

    searchLegalCases() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('legalCaseList-search', this.queryParameters.search);
        sessionStorage.setItem('legalCaseList-status', this.queryParameters.status);
        sessionStorage.setItem('legalCaseList-country_ids', this.queryParameters.country_ids);
        this.timer = this.timeout( () => {
            this.state.go('.', {
                search: this.queryParameters.search, 
                status: this.queryParameters.status,
                country_ids: this.queryParameters.country_ids});
            this.showPage(1);
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
        ctrl.searchLegalCases();
    }
    
    statusChange() {
        var ctrl = this.ctrl;
        ctrl.queryParameters.status = ctrl.status.selectedOptions[0].id;
        ctrl.searchLegalCases();
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
        this.showPage(1);
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
    
    addUrls(legalCases) {
        for (let idx=0; idx < legalCases.length; idx++) {
            let legalCase = legalCases[idx];
            if (legalCase.form_name !== null) {
                legalCase.viewUrl = this.state.href(legalCases[idx].form_name, {id:legalCase.id, stationId:legalCase.station, countryId:legalCase.country_id, incidentId:legalCase.incident, isViewing:true,formName: legalCases[idx].form_name});
                legalCase.editUrl = this.state.href(legalCases[idx].form_name, {id:legalCase.id, stationId:legalCase.station, countryId:legalCase.country_id, incidentId:legalCase.incident, isViewing:false,formName: legalCases[idx].form_name});
            }
            //legalCase.relatedUrl = this.state.href('relatedForms', {stationId: legalCase.station.id, formNumber: legalCase.legalCase_number});
        }
    }

    getLegalCaseList() {
        this.spinnerOverlayService.show("Searching for Legal Cases...");        
        this.service.getLegalCaseList(this.transform(this.queryParameters)).then( (promise) => {
            this.legalCases = promise.data.results;
            this.spinnerOverlayService.hide();      
            this.addUrls(this.legalCases);
            this.nextPage = this.extractPage(promise.data.next);        
        });
    }

    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for Legal Cases...");        
        this.service.getLegalCaseList(this.transform(this.queryParameters, pageNumber)).then( (promise) => {
            this.legalCases = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
            this.addUrls(this.legalCases);
        });
    }

    deleteLegalCase(legalCase, index) {
        if (legalCase.confirmedDelete) {
            this.service.deleteLegalCase(legalCase.station, legalCase.id).then(
                () => {
                    this.toastr.success("Successfully Deleted Legal Case!");
                    this.legalCases.splice(index, 1);
                },
                () => {
                    this.toastr.error("Unable to Delete Legal Case!");
                }
            );
        }
        else {
            legalCase.confirmedDelete = true;
        }
    }
    
    arrestColor(legalCase) {
    	let result = 'text-center';
    	if (legalCase.number_verified_arrests < legalCase.number_arrests) {
    		result += ' notAllVerified';
    	}
    	
    	return result;
    }
}
