/* global jQuery */
import selectProjectModalTemplate from './selectProjectModal.html';
import discussProjectRequestTemplate from '../discussProjectRequestModal.html';
import DiscussProjectRequestModalController from '../discussProjectRequestModal.controller.js';
import {encodeGroup} from  '../../encodeGroup.js';
import './projectRequestList.less';

class SelectProjectModalController {
    constructor($uibModalInstance, stations, $scope) {
        'ngInject';

        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        
        this.scope.stationDropDown = {};
        this.scope.stationDropDown.options = [];
		this.scope.stationDropDown.selectedOptions = [];
        this.scope.stationDropDown.settings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: false, selectionLimit:1,
        		groupByTextProvider(groupValue) { return encodeGroup(groupValue); }, groupBy:'encoded', closeOnSelect: true,
        		scrollableHeight: '250px', scrollable: true,};
        this.scope.stationDropDown.customText = {};
        this.scope.stationDropDown.eventListener = {};
        
        for (var idx=0; idx < stations.length; idx++) {
        	this.scope.stationDropDown.options.push({"id":stations[idx].id, "label":stations[idx].station_name,
        		"country":stations[idx].country_name, "encoded":encodeGroup(stations[idx].country_name), "country_id":stations[idx].country_id,
        		"mdf_project":stations[idx].mdf_project});
        }
    }

    create() {
        this.$uibModalInstance.close(this.scope.stationDropDown.selectedOptions[0]);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }
}

/* global angular */

export default class ProjectRequestListController {
    constructor(ProjectRequestService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr) {
        'ngInject';
        this.service = ProjectRequestService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.modal = $uibModal;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.toastr = toastr;
        this.countries = [];
        this.projects = [];
        this.stationsForAdd = [];

        this.timer = {};
        this.requests = [];
        this.nextPage = "";
        this.queryParameters = {
            "page_size": 20,
            "reverse": true,
            "ordering": 'project__station_name',
            "search": '',
            "status": '',
            "frequency":'',
            "discussion": '',
            "country_ids": '',
            "project_id": ''
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
            let tmp = sessionStorage.getItem('requestList-search');
            if (tmp !== null) {
                this.queryParameters.search = tmp;
            }
            tmp = sessionStorage.getItem('requestList-status');
            if (tmp !== null) {
                this.queryParameters.status = tmp;
            }
            tmp = sessionStorage.getItem('requestList-country_ids');
            if (tmp !== null) {
                this.queryParameters.country_ids = tmp;
            }
        }

        this.getUserCountries();
        this.getProjects();
        this.getProjectRequests();
        
        this.getUserStationsForAdd();
    }

    get hasAddPermission() {
        return this.session.checkPermission('PROJECT_REQUEST','ADD',null, null) === true;
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

    searchRequests() {
        if (this.timer.hasOwnProperty('$$timeoutId')) {
            this.timeout.cancel(this.timer);
        }
        sessionStorage.setItem('requestList-search', this.queryParameters.search);
        sessionStorage.setItem('requestList-status', this.queryParameters.status);
        sessionStorage.setItem('requestList-country_ids', this.queryParameters.country_ids);
        this.timer = this.timeout( () => {
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
        ctrl.queryParameters.project_id = '';
        ctrl.searchRequests();
    }
    
    statusChange() {
        var ctrl = this.ctrl;
        ctrl.queryParameters.status = ctrl.status.selectedOptions[0].id;
        ctrl.searchVdfs();
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
    
    getProjects() {
    	this.service.getUserStations(this.session.user.id).then((promise) => {
            this.projects = promise.data;
        });
    }
    
    getProjectRequests() {
    	this.showPage(1);
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
    
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for Project Requests...");        
        this.service.getRequestList(this.transform(this.queryParameters, pageNumber)).then( (promise) => {
            this.requests = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
            for (let requestIdx in this.requests) {
            	let request = this.requests[requestIdx];
            	request.can_approve = request.status === 'Submitted' && this.session.checkPermission('PROJECT_REQUEST','APPROVE',request.country_id, request.project);
            }
        });
    }
    
    review(request) {
    	this.state.go('reviewProjectRequest', {
                id: request.id,
            });
    }
    
    discuss(request) {
    	let theService = this.service;
    	let userId = this.session.user.id;
    	let modalInstance = this.modal.open({
            animation: true,
            templateUrl: discussProjectRequestTemplate,
            controller: DiscussProjectRequestModalController,
            size: 'lg',
            controllerAs: "vm",
            resolve: {
            	service() {return theService;},
                request() {return request;},
                userId() {return userId;},
            },
        });
        modalInstance.result.then(() => {
            if (request.projectrequestdiscussion_set.length < 1) {
            	// A discussion entry was added in the modal and it was
            	// the first entry.  Add a blank entry to the set to change
            	// the icon
            	request.projectrequestdiscussion_set.push({});
            }
        });
    }
    
    approve(index) {
    	let request = this.requests[index];
    	if (request.can_approve) {
    		let localRequest = jQuery.extend(true, {}, request);
    		localRequest.status = 'Approved';
    		this.spinnerOverlayService.show("Approving request...");   
    		this.service.putRequest(localRequest).then( (promise) => {
    			this.spinnerOverlayService.hide();
    			this.requests[index] = promise.data;
    		}, () => {
    			this.spinnerOverlayService.hide();
    			this.toastr.error("Failed to approve request");
    		});
    		
    	}
    }
    
    inputRequests() {
        let stationsForAdd = this.stationsForAdd;
        let modalInstance = this.modal.open({
            animation: true,
            templateUrl: selectProjectModalTemplate,
            controller: SelectProjectModalController,
            size: 'md',
            controllerAs: "vm",
            resolve: {
                stations() {return stationsForAdd;},
            },
        });
        modalInstance.result.then(station => {
        	let mdfProject = station.mdf_project;
        	if (mdfProject === null) {
        		mdfProject = station.id;
        	}
            this.state.go('inputProjectRequests', {
                id: station.id,
                name: station.label,
                mdfProject: mdfProject,
            });
        });
    }
}
