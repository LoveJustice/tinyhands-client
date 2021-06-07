/* global jQuery */
import './locationData.less';
class LocationDataController {
    constructor($rootScope, SessionService, locationDataService, SpinnerOverlayService, StickyHeader) {
        'ngInject';
        
        this.session = SessionService;
        this.service = locationDataService;
        this.sticky = StickyHeader;
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.digits2Format = {'minimumFractionDigits': 0, 'maximumFractionDigits': 2};
        
        this.countries = [];
        this.stations = null;
        this.locations = null;
        this.locationTotals = null;
        this.saveCount = 0;
        this.locationData = [null, null, null, null, null, null];
        this.locationDisplayData = [null, null, null, null, null, null];
        
        this.country = null;
        this.station = null;
        this.setCurrentMonth();
        this.tableDivSize = '1460px';
        
        let tmp = sessionStorage.getItem('station-stats-country');
        if (!tmp) {
            let tmp = window.localStorage.getItem('dashboard-country');
            if (tmp) {
                sessionStorage.setItem('station-stats-country', tmp);
            }
        }
        
        this.getCountries();
    }
    
    setCurrentMonth() {
        let today = new Date();
        this.month = today.getMonth();
        this.year = today.getFullYear();
        if (this.month < 1) {
            this.year -= 1;
            this.month = 12;
        }
        this.monthStr = '' + this.month;
        this.yearAndMonth = this.year * 100 + this.month;
        
        if (this.locations !== null) {
            this.reloadData();
        }
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
        this.getLocations();
    }
    
    changeMonth() {
        this.month = parseInt(this.monthStr);
        this.yearAndMonth = this.year * 100 + this.month;
        this.reloadData();
    }
    
    changeYear() {
        this.yearAndMonth = this.year * 100 + this.month;
        this.reloadData();
    }
    
    scrollMonth(increment) {
        this.month += increment;
        if (this.month > 12) {
            this.month = this.month - 12;
            this.year += 1;
        } else if (this.month < 1) {
            this.month = this.month + 12;
            this.year -= 1;
        }
        this.monthStr = '' + this.month;
        this.yearAndMonth = this.year * 100 + this.month;
        if (increment < 0) {
            this.locationData = this.locationData.slice(1,6);
            this.locationData.splice(6,0,null);
            this.locationDisplayData = this.locationDisplayData.slice(1,6);
            this.locationDisplayData.splice(6,0,null);
            this.populateLocationData(this.yearMonthOffset(this.yearAndMonth, -5), 5);
        } else if (increment > 0) {
            this.locationData = this.locationData.slice(0,5);
            this.locationData.splice(0,0,null);
            this.locationDisplayData = this.locationDisplayData.slice(0,5);
            this.locationDisplayData.splice(0,0,null);
            this.populateLocationData(this.yearAndMonth, 0);
        }
    }
    
    monthName(yearMonth) {
        let monthIndex = yearMonth % 100;
        return this.monthNames[monthIndex] + ' ' + Math.floor(yearMonth / 100);
    }
            
    getLocations() {
        this.service.getStationLocations(this.station).then((promise) => {
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
                this.locationTotals[this.locations[idx].id] = {staff:0, intercepts:0, arrests:0};
            }
            this.reloadData();
        });
    }
    
    reloadData() {
        this.populateLocationData(this.yearAndMonth, 0);
        this.populateLocationData(this.yearMonthOffset(this.yearAndMonth, -1), 1);
        this.populateLocationData(this.yearMonthOffset(this.yearAndMonth, -2), 2);
        this.populateLocationData(this.yearMonthOffset(this.yearAndMonth, -3), 3);
        this.populateLocationData(this.yearMonthOffset(this.yearAndMonth, -4), 4);
        this.populateLocationData(this.yearMonthOffset(this.yearAndMonth, -5), 5);
    }
    
    changeFocus(location, position) {
        this.updateTotals(location);
        let oldCell = null;
        if (this.locationData[position]) {
            for (let idx=0; idx < this.locationData[position].length; idx++) {
                if (this.locationData[position][idx] && this.locationData[position][idx].location === location) {
                    oldCell = this.locationData[position][idx];
                    break;
                }
            }
        }
        if (oldCell) {
            let arrests = null;
            if (this.locationDisplayData[position][location].arrests && !isNaN(this.locationDisplayData[position][location].arrests)) {
                arrests = this.locationDisplayData[position][location].arrests;
            }
            if (oldCell.arrests !== arrests) {
                oldCell.arrests = arrests;
                this.saveLocationStatistics(oldCell);
            }
        } else {
            if (this.locationDisplayData[position][location].arrests!==null && !isNaN(this.locationDisplayData[position][location].arrests)) {
                let newValue = {
                        year_month: this.yearMonthOffset(this.yearAndMonth, -position),
                        location: location,
                        station: this.station
                };
 
                newValue.arrests = this.locationDisplayData[position][location].arrests;
                this.locationData[position].push(newValue);
                this.saveLocationStatistics(newValue);
            }
        }
    }
    
    saveLocationStatistics(value) {
        this.saveCount +=1;
        this.service.setLocationStatistics(value).then (() =>{this.saveCount -= 1;}, ()=>{this.saveCount -= 1;});
        
    }
    
    populateLocationData(yearMonth, position) {
        if (!this.locations) {
            return;
        }
        this.service.getLocationData(this.station, yearMonth).then((promise) => {
            this.locationData.splice(position, 1, promise.data);
            let displayData = {};
            for (let idx=0; idx < this.locations.length; idx++) {
                displayData[this.locations[idx].id] = {
                        staff: null,
                        intercepts: null,
                        arrests: null
                };
            }
            for (let idx=0; idx < this.locationData[position].length; idx++) {
                let theData= this.locationData[position][idx];
                displayData[theData.location] = jQuery.extend(true, {}, theData);
            }
            this.locationDisplayData.splice(position, 1, displayData);
            for (let locationRow=0; locationRow < this.locations.length; locationRow++) {
                let location_id = this.locations[locationRow].id;
                let totals = {
                        staff:0,
                        intercepts:0,
                        arrests:0
                };
                for (let column = 0; column < this.locationDisplayData.length; column++) {
                    if (this.locationDisplayData[column] === null) {
                        continue;
                    }
                    let cell = this.locationDisplayData[column][location_id];
                    if (!cell) {
                        continue;
                    }
                    if (cell.staff && !isNaN(cell.staff)) {
                        totals.staff += cell.staff;
                    }
                    if (cell.intercepts && !isNaN(cell.intercepts)) {
                        totals.intercepts += cell.intercepts;
                    }
                    if (cell.arrests && !isNaN(cell.arrests)) {
                        totals.arrests += cell.arrests;
                    }
                }
                this.locationTotals[location_id] = totals;
            }
            this.updateBottomTotals();
        });
    }
    
    updateBottomTotals() {
        this.locationTotals._Total = {
                staff:0,
                intercepts:0,
                arrests:0
        };
        for (let idx=0; idx < this.locations.length; idx++) {
            this.locationTotals._Total.staff += this.locationTotals[this.locations[idx].id].staff;
            this.locationTotals._Total.intercepts += this.locationTotals[this.locations[idx].id].intercepts;
            this.locationTotals._Total.arrests += this.locationTotals[this.locations[idx].id].arrests;
        }
        for (let col=0; col < this.locationDisplayData.length; col++) {
            this.locationDisplayData[col]._Total = {
                    staff:0,
                    intercepts:0,
                    arrests:0
            };
            for (let idx=0; idx < this.locations.length; idx++) {
                this.locationDisplayData[col]._Total.staff += this.locationDisplayData[col][this.locations[idx].id].staff;
                this.locationDisplayData[col]._Total.intercepts += this.locationDisplayData[col][this.locations[idx].id].intercepts;
                this.locationDisplayData[col]._Total.arrests += this.locationDisplayData[col][this.locations[idx].id].arrests;
            }
        }
    }
    
    updateTotals(location) {
        let tot = 0;
        for (let idx=0; idx < this.locationDisplayData.length; idx++) {
            let value = this.locationDisplayData[idx][location].arrests;
            if (!isNaN(value)) {
                tot += value;
            }
        }
        this.locationTotals[location].arrests = tot;
        this.updateBottomTotals();
    }
}

export default LocationDataController;