/* global angular */
import './staffList.less';
export default class StaffListController {
    constructor(StaffService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $timeout,  toastr, constants, moment) {
        'ngInject';
        this.service = StaffService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.toastr = toastr;
        this.constants = constants;
        this.moment = moment;
        this.countries = [];
        this.projects = [];
        this.staffList = [];

        this.timer = {};
        this.nextPage = "";
        this.queryParameters = {
            "page_size": 15,
            "reverse": false,
            "ordering": 'first_name',
            "search": '',
            "country_ids": '',
            "project_id": ''
        };
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.projectCategoryOptions = [];
        
        this.paginate = {
                items:0,
                pageSize:this.queryParameters.page_size,
                currentPage:1,
            };
        this.countryDropDown = {};
        this.countryDropDown.options = [];
        this.countryDropDown.selectedOptions = [];
        this.countryDropDown.settings = {smartButtonMaxItems:2, showCheckAll: false, showUncheckAll: false, selectionLimit:1,};
        this.countryDropDown.customText = {buttonDefaultText: 'All'};
        this.countryDropDown.eventListener = {
            onItemSelect: this.countryChange,
            onItemDeselect: this.countryChange,
            onSelectAll: this.countryChange,
            onDeselectAll: this.countryChange,
            ctrl: this   
        };

        let tmp = sessionStorage.getItem('staffList-search');
        if (tmp !== null) {
            this.queryParameters.search = tmp;
        }
        tmp = sessionStorage.getItem('staffList-country_ids');
        if (tmp !== null) {
            this.queryParameters.country_ids = tmp;
        }

        this.getUserCountries();
        this.getUserProjects();
        //this.getStaffList();
    }

    get hasAddPermission() {
        return this.session.checkPermission('PROJECTS','ADD',null, null) === true;
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

    searchStaff() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('staffList-search', this.queryParameters.search);
        sessionStorage.setItem('staffList-country_ids', this.queryParameters.country_ids);
        this.timer = this.timeout( () => {
            this.getStaffList(1);
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
        ctrl.queryParameters.project_id = '';
        ctrl.searchStaff();
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
        } else {
        	this.queryParameters.reverse = false;
        }
        this.queryParameters.ordering = column;
        this.getStaffList();
    }
    
    getUserProjects() {
    	this.spinnerOverlayService.show("Searching for Staff..."); 
        this.service.getUserStations(this.session.user.id).then((response) => {
           	this.projects = response.data;
           	this.getStaffList();
        }, () => {
        	this.spinnerOverlayService.hide();
        });
    }
    
    getUserCountries() {
        this.service.getUserCountries(this.session.user.id).then((promise) => {
            this.countries = promise.data;
            this.countryDropDown.options = [];
            for (var idx=0; idx < this.countries.length; idx++) {
                this.countryDropDown.options.push({id: this.countries[idx].id, label: this.countries[idx].name});
            }
            
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
    
    getCountryName(countryId) {
    	let countryName = 'Unknown';
    	for (let idx in this.countries) {
    		if (countryId === this.countries[idx].id) {
    			countryName = this.countries[idx].name;
    			break;
    		}
    	}
    	
    	return countryName;
    }
    
    addUrls(staffList) {
        for (let idx=0; idx < staffList.length; idx++) {
            let staff = staffList[idx];
            staff.viewUrl = this.state.href('staff', {id:staff.id, isViewing:true});
            staff.editUrl = this.state.href('staff', {id:staff.id, isViewing:false });
        }
    }
    
    projectText(staffList) {
    	for (let idx=0; idx < staffList.length; idx++) {
            let staff = staffList[idx];
            staff.projectText = '';
            let sep = '';
            for (let staffProjIdx in staff.staffproject_set) { 
            	for (let projIdx in this.projects) {
            		if (staff.staffproject_set[staffProjIdx].border_station === this.projects[projIdx].id) {
		            	staff.projectText += sep + this.projects[projIdx].station_name;
		            	sep = '/';
		            }
            	}
            }
        }
    }

    getStaffList() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for Staff...");        
        this.service.getStaffList(this.transform(this.queryParameters, pageNumber)).then( (promise) => {
            this.staffList = promise.data.results;
            this.projectText(this.staffList);
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
            this.addUrls(this.staffList);
        }, () => {
        	this.spinnerOverlayService.hide();
        });
    }
}
