import createCifModalTemplate from './createCifModal.html';

/* global angular */

export default class CifListController {
    constructor(CifListService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr, constants, moment) {
        'ngInject';
        this.service = CifListService;
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
        this.cifs = [];
        this.nextPage = "";
        this.timeZoneDifference ="+0545";
        this.queryParameters = {
            "page_size": 25,
            "reverse": true,
            "ordering": 'date_time_of_interception',
            "search": '',
            "status": 'approved',
            "country_ids": ''
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
        this.status.options = [{id: 'approved', label: 'approved'}, {id: 'in-progress', label: 'in-progress'}];
		this.status.selectedOptions = [this.status.options[0]];
        this.status.settings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: false, selectionLimit:1, closeOnSelect: true};
        this.status.customText = {};
        this.status.eventListener = {
        	onItemSelect: this.statusChange,
        	ctrl: this
        };

        // If there was a search value provided in the url, set it
        if($stateParams) {
           this.queryParameters.search = $stateParams.search;
           this.queryParameters.status = $stateParams.status;
           if ($stateParams.country_ids) {
        	   this.queryParameters.country_ids = $stateParams.country_ids;
           }
           
           if (this.queryParameters.status === 'in-progress') {
        	   this.status.selectedOptions = [this.status.options[1]];
           } else {
        	   this.queryParameters.status = 'approved';
           }
        }

        this.getUserCountries();
        this.getCifList();
        
        this.getUserStationsForAdd();
    }

    get hasAddPermission() {
        return this.session.checkPermission('CIF','ADD',null, null) === true;
    }

    transform(queryParams) {
        var queryParameters = angular.copy(queryParams);
        if (queryParameters.reverse) {
            queryParameters.ordering = '-' + queryParameters.ordering;
        }
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
    
    createCif() {
    	var stationsForAdd = this.stationsForAdd;
    	let modalInstance = this.modal.open({
            animation: true,
            templateUrl: createCifModalTemplate,
            controller: 'CreateCifModalController as vm',
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
        			this.state.go(response.data[0].form_name, {stationId: station.id, countryId: station.country_id, isViewing:false});
        		} else {
        			this.toastr.error("Unable to find form for station " + station.label);
        		}
        	});
        });
    }

    searchCifs() {
        this.timeout.cancel(this.timer);
        this.timer = this.timeout( () => {
            this.state.go('.', {
            	search: this.queryParameters.search, 
            	status: this.queryParameters.status,
            	country_ids: this.queryParameters.country_ids});
            this.getCifList();
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
    	ctrl.searchCifs();
    }
    
    statusChange() {
    	var ctrl = this.ctrl;
    	ctrl.queryParameters.status = ctrl.status.selectedOptions[0].id;
    	ctrl.searchCifs();
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
        this.getCifList();
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
    
    addUrls(cifs) {
    	for (let idx=0; idx < cifs.length; idx++) {
    		let cif = cifs[idx];
    		if (cif.form_name !== null) {
    			cif.viewUrl = this.state.href(cifs[idx].form_name, {id:cif.id, stationId:cif.station.id, countryId:cif.station.operating_country.id, isViewing:true});
    			cif.editUrl = this.state.href(cifs[idx].form_name, {id:cif.id, stationId:cif.station.id, countryId:cif.station.operating_country.id, isViewing:false});
    		}
    	}
    }

    getCifList() {
        this.spinnerOverlayService.show("Searching for CIFs...");        
        this.service.getCifList(this.transform(this.queryParameters)).then( (promise) => {
            this.cifs = promise.data.results;
            this.addUrls(this.cifs);
            this.nextPage = this.extractPage(promise.data.next);
            this.spinnerOverlayService.hide();        
        });
    }

    showMoreCifs() {
        let params = angular.copy(this.queryParameters);
        params.page = this.nextPage;
        this.service.getMoreCifs(this.transform(params)).then( (promise) => {
            this.cifs = this.cifs.concat(promise.data.results);
            this.nextPage = this.extractPage(promise.data.next);
            this.addUrls(this.cifs);
        });
    }

    deleteCif(cif, index) {
        if (cif.confirmedDelete) {
            this.service.deleteCif(cif.station.id, cif.id).then(
                () => {
                    this.toastr.success("Successfully Deleted CIF!");
                    this.cifs.splice(index, 1);
                },
                () => {
                    this.toastr.error("Unable to Delete CIF!");
                }
            );
        }
        else {
            cif.confirmedDelete = true;
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
        return `cif-all-data-${date}.csv`;
    }
}
