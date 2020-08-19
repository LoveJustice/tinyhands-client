import './locationStaff.less';
class LocationStaffController {
    constructor($rootScope, SessionService, locationStaffService, SpinnerOverlayService, StickyHeader) {
        'ngInject';
        
        this.session = SessionService;
        this.service = locationStaffService;
        this.sticky = StickyHeader;
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
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
        this.station = null;
        let today = new Date();
        this.month = today.getMonth() + 1;
        this.monthStr = '' + this.month;
        this.year = today.getFullYear();
        this.yearAndMonth = this.year * 100 + this.month;
        this.tableDivSize = '102px';
        
        let tmp = sessionStorage.getItem('station-stats-country');
        if (!tmp) {
            let tmp = window.localStorage.getItem('dashboard-country');
            if (tmp) {
                sessionStorage.setItem('station-stats-country', tmp);
            }
        }
        
        this.getCountries();
    }
    
    getCountries() {
        let selectedCountryName = sessionStorage.getItem('station-stats-country');
        this.service.getUserCountries(this.session.user.id, 'STATION_STATISTICS', 'EDIT').then((promise) => {
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
        this.service.getUserStations(this.session.user.id, 'STATION_STATISTICS', 'EDIT', this.country).then((promise) => {
            this.stations = promise.data;
            for (let idx=0; idx < this.stations.length; idx++) {
                if (this.stations[idx].station_name === selectedStationName) {
                    this.station = '' + this.stations[idx].id;
                    this.changeStation();
                    break;
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
    
    changeStation() {
        for (let idx=0; idx < this.stations.length; idx++) {
            if (('' + this.stations[idx].id) === this.station) {
                sessionStorage.setItem('station-stats-station', this.stations[idx].station_name);
                break;
            }
        }
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
        this.workPortion = null;
        this.work = null;
        this.resetTotals();
        this.service.getLocationStaff(this.station, this.yearAndMonth).then((promise) => {
            this.workPortion = promise.data;
            this.populateWork();
        });
    }
    
    changeYear() {
        this.yearAndMonth = this.year * 100 + this.month;
        this.workPortion = null;
        this.work = null;
        this.resetTotals();
        this.service.getLocationStaff(this.station, this.yearAndMonth).then((promise) => {
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
        this.service.getStationLocations(this.station).then((promise) => {
            this.locations = promise.data;
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
        });
        this.service.getStationStaff(this.station).then((promise) => {
            this.staff = promise.data;
            this.staffTotals = {};
            for (let idx=0; idx < this.staff.length; idx++) {
                this.staffTotals[this.staff[idx].id] = 0;
            }
            this.populateWork();
        });
        this.service.getLocationStaff(this.station, this.yearAndMonth).then((promise) => {
            this.workPortion = promise.data;
            this.populateWork();
        });
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
                oldValue.work_fraction = 0.0;
            } else {
                oldValue.work_fraction = this.work[location][staff];
            }
            this.saveWorkFraction(oldValue);
        } else {
            if (this.work[location][staff]!==null && !isNaN(this.work[location][staff])) {
                let newValue = {
                        year_month: this.yearAndMonth,
                        location: location,
                        staff: staff,
                        work_fraction: this.work[location][staff]
                };
                this.workPortion.push(newValue);
                this.saveWorkFraction(newValue);
            }
        }
    }
    
    saveWorkFraction(value) {
        this.saveCount +=1;
        this.service.setWorkFraction(value).then (() =>{this.saveCount -= 1;}, ()=>{this.saveCount -= 10;});
    }
    
    populateWork() {
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
            this.work[tmp.location][tmp.staff] = tmp.work_fraction;
            this.updateTotals(tmp.location, tmp.staff);
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
    
    totalColor(base, total) {
        if (total === 1.00) {
            return base + ' goodTotal';
        } else if (total > 1) {
            return base + ' badTotal';
        } else {
            return base;
        }
    }
}

export default LocationStaffController;