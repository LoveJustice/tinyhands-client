/* global angular */
import './borderStationList.less';
export default class BorderStationListController {
    constructor(BorderStationService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $timeout,  toastr, constants, moment) {
        'ngInject';
        this.service = BorderStationService;
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
        this.stationsForAdd = [];

        this.timer = {};
        this.projects = [];
        this.nextPage = "";
        this.queryParameters = {
            "page_size": 20,
            "reverse": false,
            "ordering": 'station_name',
            "search": '',
            "country_ids": '',
            "project_category":'' ,
            "include_closed":false
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
        this.countryDropDown.settings = {smartButtonMaxItems:2, showCheckAll: false, showUncheckAll: false,};
        this.countryDropDown.customText = {buttonDefaultText: 'All'};
        this.countryDropDown.eventListener = {
            onItemSelect: this.countryChange,
            onItemDeselect: this.countryChange,
            onSelectAll: this.countryChange,
            onDeselectAll: this.countryChange,
            ctrl: this   
        };

        let tmp = sessionStorage.getItem('projectList-search');
        if (tmp !== null) {
            this.queryParameters.search = tmp;
        }
        tmp = sessionStorage.getItem('projectList-country_ids');
        if (tmp !== null) {
            this.queryParameters.country_ids = tmp;
        }
        tmp = sessionStorage.getItem('projectList-project_category');
        if (tmp !== null) {
            this.queryParameters.project_category = tmp;
        }

        this.getUserCountries();
        this.getAllCategories();
        this.getBorderStationList();
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

    searchBorderStations() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('projectList-search', this.queryParameters.search);
        sessionStorage.setItem('projectList-country_ids', this.queryParameters.country_ids);
        sessionStorage.setItem('projectList-project_category', this.queryParameters.project_category);
        this.timer = this.timeout( () => {
            this.getBorderStationList(1);
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
        ctrl.searchBorderStations();
    }
    
    getAllCategories() {
        this.service.getAllProjectCategories().then((response) => {
            var tmpCategories = response.data;
            this.projectCategoryOptions = [];
            for (var idx=0; idx < tmpCategories.length; idx++) {
                this.projectCategoryOptions.push(tmpCategories[idx]);
            }
        });
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
        this.getBorderStationList();
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
    
    addUrls(projects) {
        for (let idx=0; idx < projects.length; idx++) {
            let project = projects[idx];
            project.viewUrl = this.state.href('border-station', {id:project.id, new_staff:true});
        }
    }

    getBorderStationList() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for Projects...");        
        this.service.getBorderStationList(this.transform(this.queryParameters, pageNumber)).then( (promise) => {
            this.projects = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
            this.addUrls(this.projects);
        });
    }
}
