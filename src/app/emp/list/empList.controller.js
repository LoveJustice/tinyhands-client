import createEmpModalTemplate from './createEmpModal.html';

/* global angular */

export default class EmpListController {
    constructor(EmpListService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr, constants, moment) {
        'ngInject';
        this.service = EmpListService;
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
        this.emps = [];
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
            let tmp = sessionStorage.getItem('empList-search');
            if (tmp !== null) {
                this.queryParameters.search = tmp;
            }
            tmp = sessionStorage.getItem('empList-status');
            if (tmp !== null) {
                this.queryParameters.status = tmp;
            }
            tmp = sessionStorage.getItem('empList-country_ids');
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
        this.getEmpList();
        
        this.getUserStationsForAdd();
    }

    get hasAddPermission() {
        return this.session.checkPermission('EMP','ADD',null, null) === true;
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
    
    createEmp() {
        var stationsForAdd = this.stationsForAdd;
        let modalInstance = this.modal.open({
            animation: true,
            templateUrl: createEmpModalTemplate,
            controller: 'CreateEmpModalController as vm',
            size: 'md',
            resolve: {
                stations() {
                    return stationsForAdd;
                }
            }
        });
        modalInstance.result.then((station) => {
            this.state.go('emp', {stationId: station.id, countryId: station.country_id, isViewing:false});
        });
    }

    searchEmps() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('empList-search', this.queryParameters.search);
        sessionStorage.setItem('empList-status', this.queryParameters.status);
        sessionStorage.setItem('empList-country_ids', this.queryParameters.country_ids);
        this.timer = this.timeout( () => {
            this.state.go('.', {
                search: this.queryParameters.search, 
                status: this.queryParameters.status,
                country_ids: this.queryParameters.country_ids});
            this.getEmpList(1);
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
        ctrl.searchEmps();
    }
    
    statusChange() {
        var ctrl = this.ctrl;
        ctrl.queryParameters.status = ctrl.status.selectedOptions[0].id;
        ctrl.searchEmps();
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
        this.getEmpList();
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
    
    addUrls(emps) {
        for (let idx=0; idx < emps.length; idx++) {
            let emp = emps[idx];
            if (emp.form_name !== null) {
                emp.viewUrl = this.state.href('emp', {id:emp.id, stationId:emp.station, isViewing:true});
                emp.editUrl = this.state.href('emp', {id:emp.id, stationId:emp.station, isViewing:false});
            }
        }
    }

    getEmpList() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for Emps...");        
        this.service.getEmpList(this.transform(this.queryParameters, pageNumber)).then( (promise) => {
            this.emps = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
            this.addUrls(this.emps);
        });
    }
}
