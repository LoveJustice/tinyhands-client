/* global jQuery */
/* global alert */
import './locationStaff.less';
class LocationStaffController {
    constructor($rootScope, SessionService, locationStaffService, StickyHeader) {
        'ngInject';
        
        this.session = SessionService;
        this.service = locationStaffService;
        this.sticky = StickyHeader;
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.stationDropDown = {};
        this.stationDropDown.options = [];
        this.stationDropDown.selectedOptions = [];
        this.stationDropDown.settings = {smartButtonMaxItems:1, showCheckAll: false, showUncheckAll: false, selectionLimit:1,
                groupBy:'type', closeOnSelect: true, scrollableHeight: '250px', scrollable: true,};
        //this.stationDropDown.customText = {};
        this.stationDropDown.eventListener = {
                onItemSelect: this.stationChangeEvent,
                ctrl: this,
        };
        this.editAll = this.session.checkPermission('PROJECT_STATISTICS','EDIT_ALL',null, null);
        
        this.countries = [];
        this.stations = null;
        this.locations = null;
        this.locationTotals = null;
        this.staff = null;
        this.staffTotals = null;
        this.workPortion = null;
        this.work = null;
        this.saveCount = 0;
        
        this.country = null;
        this.tableDivSize = '102px';
        
        let tmp = sessionStorage.getItem('station-stats-country');
        if (!tmp) {
            let tmp = window.localStorage.getItem('dashboard-country');
            if (tmp) {
                sessionStorage.setItem('station-stats-country', tmp);
            }
        }
        
        let today = new Date();
        this.month = today.getMonth();
        this.year = today.getFullYear();
        if (this.month < 1) {
            this.year -= 1;
            this.month = 12;
        }
        this.monthStr = '' + this.month;
        this.yearAndMonth = this.year * 100 + this.month;
        
        this.editYearMonth = [
            this.yearAndMonth,
            this.yearMonthOffset(this.yearAndMonth, 1)
        ];
        
        tmp = sessionStorage.getItem('station-stats-yearmonth');
        if (tmp && tmp.length === 6) {
        	this.yearAndMonth = parseInt(tmp);
        	this.month = this.yearAndMonth % 100;
        	this.year = Math.floor(this.yearAndMonth / 100);
        	this.monthStr = '' + this.month;
        } 
        
        this.firstOfMonth = new Date(this.year, this.month-1, 1);
        if (this.month > 10) {
            this.firstOfNextMonth = new Date(this.year+1, 0, 1);
        } else {
            this.firstOfNextMonth = new Date(this.year, this.month, 1);
        }
        
        this.getCountries();
    }
    
    yearMonthOffset(start, offset) {
        let year = Math.floor(start/100);
        let month = start % 100;
        month += offset;
        while (month < 1) {
            year -= 1;
            month += 12;
        }
        while (month > 12) {
            year += 1;
            month -= 12;
        }
        return year * 100 + month;
    }
    
    getCountries() {
        let selectedCountryName = sessionStorage.getItem('station-stats-country');
        this.service.getUserCountries(this.session.user.id, 'PROJECT_STATISTICS', 'VIEW').then((promise) => {
            this.countries = promise.data;
            for (let idx=0; idx < this.countries.length; idx++) {
                if (this.countries[idx].name === selectedCountryName) {
                    this.country = '' + this.countries[idx].id;
                    this.changeCountry();
                    break;
                }
            }
        });
    }
    
    getStations() {
        let selectedStationName = sessionStorage.getItem('station-stats-station');
        this.service.getUserStations(this.session.user.id, 'PROJECT_STATISTICS', 'VIEW', this.country).then((promise) => {
            this.stations = promise.data;
            this.stationDropDown.options = [];
            for (var idx=0; idx < this.stations.length; idx++) {
                let type=this.stations[idx].project_category_name;
                let option = {"id":this.stations[idx].id, "label":this.stations[idx].station_name,"type":type};
                this.stationDropDown.options.push(option);
                if (this.stations[idx].station_name === selectedStationName) {
                    this.stationDropDown.selectedOptions = [option];
                    this.changeStation();
                }
            }
        });
    }
    
    changeCountry() {
        for (let idx=0; idx < this.countries.length; idx++) {
            if (('' + this.countries[idx].id) === this.country) {
                sessionStorage.setItem('station-stats-country', this.countries[idx].name);
                break;
            }
        }
        this.isViewing = true;
        if (this.session.checkPermission('PROJECT_STATISTICS','EDIT', parseInt(this.country), null)) {
            this.isViewing = false;
        }
        this.station = null;
        this.stations = null;
        this.locations = null;
        this.locationTotals = null;
        this.staff = null;
        this.staffTotals = null;
        this.workPortion = null;
        this.work = null;
        this.getStations();
    }
    
    stationChangeEvent() {
        this.ctrl.changeStation();
    }
    
    changeStation() {
        sessionStorage.setItem('station-stats-station', this.stationDropDown.selectedOptions[0].label);
        this.locations = null;
        this.locationTotals = null;
        this.staff = null;
        this.staffTotals = null;
        this.workPortion = null;
        this.work = null;
        this.getLocationsAndStaff();
    }
    
    changeMonth() {
        this.month = parseInt(this.monthStr);
        this.yearAndMonth = this.year * 100 + this.month;
        this.firstOfMonth = new Date(this.year, this.month-1, 1);
        if (this.month > 10) {
            this.firstOfNextMonth = new Date(this.year+1, 0, 1);
        } else {
            this.firstOfNextMonth = new Date(this.year, this.month, 1);
        }
        this.filterStaff();
        sessionStorage.setItem('station-stats-yearmonth', '' + this.yearAndMonth);
        this.workPortion = null;
        this.work = null;
        this.resetTotals();
        this.service.getLocationStaff(this.stationDropDown.selectedOptions[0].id, this.yearAndMonth).then((promise) => {
            this.workPortion = promise.data;
            this.populateWork();
        });
    }
    
    changeYear() {
        this.yearAndMonth = this.year * 100 + this.month;
        this.firstOfMonth = new Date(this.year, this.month-1, 1);
        if (this.month > 10) {
            this.firstOfNextMonth = new Date(this.year+1, 0, 1);
        } else {
            this.firstOfNextMonth = new Date(this.year, this.month, 1);
        }
        this.filterStaff();
        this.workPortion = null;
        this.work = null;
        this.resetTotals();
        this.service.getLocationStaff(this.stationDropDown.selectedOptions[0].id, this.yearAndMonth).then((promise) => {
            this.workPortion = promise.data;
            this.populateWork();
        });
    }
    
    resetTotals() {
        this.locationTotals = {};
        for (let idx=0; idx < this.locations.length; idx++) {
            this.locationTotals[this.locations[idx].id] = 0;
        }
        this.staffTotals = {};
        for (let idx=0; idx < this.staff.length; idx++) {
            this.staffTotals[this.staff[idx].id] = 0;
        }
    }
    
    getLocationsAndStaff() {
        this.service.getStationLocations(this.stationDropDown.selectedOptions[0].id).then((promise) => {
        	let tmpLocations = promise.data;
        	this.locations = [];
        	for (let idx=0; idx < tmpLocations.length; idx++) {
        		if (tmpLocations[idx].location_type === 'monitoring') {
        			this.locations.push(tmpLocations[idx]);
        		}
        	}
        	for (let idx=0; idx < tmpLocations.length; idx++) {
        		if (tmpLocations[idx].location_type !== 'monitoring') {
        			this.locations.push(tmpLocations[idx]);
        		}
        	}
            this.locationTotals = {};
            for (let idx=0; idx < this.locations.length; idx++) {
                this.locationTotals[this.locations[idx].id] = 0;
            }
            this.populateWork();
            this.tableWidth = 300 + 100*this.locations.length;
            let available = window.innerWidth - 304;
            let columns = Math.floor(available/120);
            let displayed_locations = 0;
            for (let idx=0; idx < this.locations.length; idx++) {
                if (this.locations[idx].active || this.locationTotals[this.locations[idx].id] > 0) {
                    displayed_locations = displayed_locations + 1;
                }
            }
            if (displayed_locations < columns) {
                this.tableDivSize = (displayed_locations * 120 + 302) + 'px';
            } else {
                if (columns < 1) {
                    columns = 1;
                }
                this.tableDivSize = (columns * 120 + 302) + 'px';
            }
            this.service.getLocationStaff(this.stationDropDown.selectedOptions[0].id, this.yearAndMonth).then((promise) => {
	            this.workPortion = promise.data;
	            this.populateWork();
	        });
        });
        
        this.service.getStationStaff(this.stationDropDown.selectedOptions[0].id, this.yearAndMonth).then((promise) => {
            this.allStaff = promise.data;
            this.filterStaff();
            this.staffTotals = {};
            for (let idx=0; idx < this.staff.length; idx++) {
                this.staffTotals[this.staff[idx].id] = 0;
            }
            this.populateWork();
        });
        
    }
    
    filterStaff() {
        this.staff = [];
        for (let idx=0; idx < this.allStaff.length; idx++) {
            if (this.allStaff[idx].first_date !== null) {
                let firstDate = new Date(this.allStaff[idx].first_date);
                if (firstDate >= this.firstOfNextMonth) {
                    continue;
                }
            }
            if (this.allStaff[idx].last_date !== null) {
                let lastDate = new Date(this.allStaff[idx].last_date);
                if (lastDate < this.firstOfMonth) {
                    continue;
                }
            }
            
            this.staff.push(this.allStaff[idx]);
        }
        
    }
    
    changeFocus(location, staff) {
        this.updateTotals(location,staff);
        let oldValue = null;
        for (let idx=0; idx < this.workPortion.length; idx++) {
            if (this.workPortion[idx].location === location && this.workPortion[idx].staff === staff) {
                oldValue = this.workPortion[idx];
                break;
            }
        }
        if (oldValue) {
            if (isNaN(this.work[location][staff])) {
            	this.toastr.error('Invalid number format ');
            	this.work[location][staff] = Math.round(oldValue.work_fraction * 100);
            	return;
            }  
            if (Math.round(oldValue.work_fraction*100) !== this.work[location][staff]){
                oldValue.work_fraction = this.work[location][staff] / 100;
                this.saveWorkFraction(oldValue, location, staff);
            }
        } else {
            if (this.work[location][staff]!==null && !isNaN(this.work[location][staff])) {
                let newValue = {
                        year_month: this.yearAndMonth,
                        location: location,
                        staff: staff,
                        work_fraction: this.work[location][staff]/100
                };
                this.workPortion.push(newValue);
                this.saveWorkFraction(newValue, location, staff);
            }
        }
    }
    
    saveWorkFraction(value, location, staff, ignoreOldWorkFraction) {
    	let newValue = ignoreOldWorkFraction;
    	newValue = jQuery.extend(true, {}, value);
        this.saveCount +=1;
        this.service.setWorkFraction(newValue).then (() =>{
	        	this.saveCount -= 1;
	        }, ()=>{
	        	this.saveCount -= 1;
	        	let locationName = 'Unknown';
	        	let staffName = 'Unknown';
	        	for (let idx=0; idx < this.locations.length; idx++) {
	        		if (this.locations[idx].id === location) {
	        			locationName = this.locations[idx].name;
	        		}
        		}
        		for (let idx=0; idx < this.staff.length; idx++) {
		            if (this.staff[idx].id === staff) {
		            	staffName = this.staff[idx].first_name + ' ' + this.staff[idx].last_name;
		            }
		        }
		        
		        alert('Failed to update data for location:' + locationName + " and staff:" + staffName + '\nReloading page');
		        window.location.reload();
		        
        	});
    }
    
    populateWork() {
        this.editOkay = this.editYearMonth.includes(this.yearAndMonth);
        if (!this.locations || !this.staff || !this.workPortion) {
            return;
        }
        this.work = {};
        for (let locIdx=0; locIdx < this.locations.length; locIdx++) {
            this.work[this.locations[locIdx].id] = {};
            for (let staffIdx=0; staffIdx < this.staff.length; staffIdx++) {
                this.work[this.locations[locIdx].id][this.staff[staffIdx].id] = null;
            }
        }
        for (let idx=0; idx < this.workPortion.length; idx++) {
            let tmp = this.workPortion[idx];
            if (tmp.location in this.work) {
	            this.work[tmp.location][tmp.staff] = Math.round(tmp.work_fraction * 100);
	            this.updateTotals(tmp.location, tmp.staff);
            }
        }
    }
    
    updateTotals(location, staff) {
        let tot = 0;
        for (let idx=0; idx < this.staff.length; idx++) {
            let value = this.work[location][this.staff[idx].id];
            if (!isNaN(value)) {
                tot += value;
            }
        }
        this.locationTotals[location] = Math.round(tot * 100)/100;
        
        tot = 0;
        for (let idx=0; idx < this.locations.length; idx++) {
            let value = this.work[this.locations[idx].id][staff];
            if (!isNaN(value)) {
                tot += value;
            }
        }
        this.staffTotals[staff] = Math.round(tot * 100)/100;
    }
    
    getWorkGoal(staff) {
        let workGoal = 100;
        for (let workIdx in staff.works_on) {
            if (staff.works_on[workIdx].works_on.project_id === this.stationDropDown.selectedOptions[0].id) {
                workGoal = staff.works_on[workIdx].percent;
            }
        }
        return workGoal;
    }
    
    totalColor(base, staff) {
        let total = this.staffTotals[staff.id];
        let workGoal = this.getWorkGoal(staff);
        if (total === workGoal) {
            return base + ' goodTotal';
        } else if (total > workGoal) {
            return base + ' badTotal';
        } else {
            return base;
        }
    }
    
    mayEdit() {
        if (this.editAll) {
            return true;
        }
        return this.editOkay;
    }
}

export default LocationStaffController;