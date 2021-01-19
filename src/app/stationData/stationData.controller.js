/* global jQuery */
import './stationData.less';
class StationDataController {
    constructor($rootScope, SessionService, stationDataService, SpinnerOverlayService, StickyHeader) {
        'ngInject';
        
        this.session = SessionService;
        this.service = stationDataService;
        this.spinner = SpinnerOverlayService;
        this.stickyOptions = StickyHeader.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.stickyOptions.top = 50;
        this.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.countries = [];
        this.stations = null;
        this.stationData = [null, null, null];
        this.stationDisplayData = [null, null, null];
        this.exchangeData = [null, null, null];
        this.exchangeDisplayData = [null, null, null];
        this.saveCount = 0;
        
        this.setCurrentMonth();
        
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
        this.yearMonth = this.year * 100 + this.month;
        
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
    
    contextMenu(e) {
        if (e.ctrlKey){
        }
    }
    
    getCountries() {
        let selectedCountryName = sessionStorage.getItem('station-stats-country');
        this.service.getUserCountries(this.session.user.id, 'STATION_STATISTICS', 'EDIT').then((promise) => {
            this.countries = promise.data;
            this.country = null;
            for (let idx=0; idx < this.countries.length; idx++) {
                if (this.countries[idx].name === selectedCountryName) {
                    this.country = '' + this.countries[idx].id;
                    break;
                }
            }
            
            this.countrySelect();
        });
    }
    
    countrySelect() {
        if (this.country) {
            this.stations = null;
            this.stationData = [{}, {}, {}];
            this.stationDisplayData = [{}, {}, {}];
            this.exchangeData = [{}, {}, {}];
            this.exchangeDisplayData = [{}, {}, {}];
            this.service.getUserStations(this.session.user.id, 'STATION_STATISTICS', 'EDIT', this.country).then ((promise) => {
                this.stations = promise.data;
                this.reloadData();
            });
            for (let idx=0; idx < this.countries.length; idx++) {
                if (('' + this.countries[idx].id) === this.country) {
                    this.selectedCountry = this.countries[idx];
                    sessionStorage.setItem('station-stats-country', this.countries[idx].name);
                    break;
                }
            }
        }
    }
    
    reloadData() {
        this.loadCount = 3;
        this.spinner.show('Loading station data...');
        this.getStationData(this.yearMonth, 0);
        this.getStationData(this.yearMonthOffset(this.yearMonth, -1), 1);
        this.getStationData(this.yearMonthOffset(this.yearMonth, -2), 2);
    }
    
    getStationData(yearMonth, position) {
        this.service.getExchangeRate(this.country, yearMonth).then ((promise) => {
            this.exchangeData[position] = promise.data;
            this.exchangeDisplayData[position] = jQuery.extend(true, {}, this.exchangeData[position]);
        });
        this.service.getStationData(this.country, yearMonth).then((promise) => {
            this.stationData[position] = promise.data;
            let displayData = {};
            for (let idx=0; idx < this.stations.length; idx++) {
                displayData[this.stations[idx].id] = {
                    staff:null,
                    intercepts:null,
                    arrests:null,
                    gospel:null,
                    empowerment:null,
                    budget:null
                };
            }
            for (let idx=0; idx < this.stationData[position].length; idx++) {
                displayData[this.stationData[position][idx].station] = jQuery.extend(true, {}, this.stationData[position][idx]);
            }
            this.stationDisplayData[position] = displayData;
            this.loadCount -= 1;
            if (this.loadCount < 1) {
                this.spinner.hide();
            }
        });
        
    }
    
    setMonth() {
        this.month = parseInt(this.monthStr);
        this.yearMonth = this.year * 100 + this.month;
        this.reloadData();
    }
    
    setYear() {
        this.yearMonth = this.year * 100 + this.month;
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
        this.yearMonth = this.year * 100 + this.month;
        if (increment < 0) {
            this.exchangeData = this.exchangeData.slice(1,3);
            this.exchangeData.splice(3,0,null);
            this.exchangeDisplayData = this.exchangeDisplayData.slice(1,3);
            this.exchangeDisplayData.splice(3,0,null);
            
            this.stationData = this.stationData.slice(1,3);
            this.stationData.splice(3,0,null);
            this.stationDisplayData = this.stationDisplayData.slice(1,3);
            this.stationDisplayData.splice(3,0,null);
            this.getStationData(this.yearMonthOffset(this.yearMonth, -2), 2);
        } else if (increment > 0) {
            this.exchangeData = this.exchangeData.slice(0,2);
            this.exchangeData.splice(0,0,null);
            this.exchangeDisplayData = this.exchangeDisplayData.slice(0,2);
            this.exchangeDisplayData.splice(0,0,null);
            
            this.stationData = this.stationData.slice(0,2);
            this.stationData.splice(0,0,null);
            this.stationDisplayData = this.stationDisplayData.slice(0,2);
            this.stationDisplayData.splice(0,0,null);
            this.getStationData(this.yearMonth, 0);
        }
    }
    
    changeMonth(increment) {
        this.month += increment;
        if (this.month > 12) {
            this.month = 1;
            this.year += 1;
        }
        if (this.month < 1) {
            this.month = 12;
            this.year -= 1;
        }
        this.monthStr = '' + this.month;
        
        this.countrySelect();
    }
    
    monthName(yearMonth) {
        let monthIndex = yearMonth % 100;
        return this.monthNames[monthIndex] + ' ' + Math.floor(yearMonth / 100);
    }
    
    hasBeenModified() {
        for (let idx=0; idx < this.dataEntryData.length; idx++) {
            for (let element in this.dataEntryData[idx]) {
                if (element ==='$$hashKey') {
                    continue;
                }
                if (this.dataEntryData[idx][element] !== this.originalData[idx][element]) {
                    return true;
                }
            }
        }
        return false;
    }
    
    changeExchangeFocus(position) {
        if (this.exchangeDisplayData[position].exchange_rate && this.exchangeDisplayData[position].exchange_rate !== this.exchangeData[position].exchange_rate) {
            this.exchangeData[position].exchange_rate = this.exchangeDisplayData[position].exchange_rate;
            this.saveCount += 1;
            this.service.updateExchangeRate(this.exchangeData[position]).then (() => {
                this.saveCount -= 1;
            });
        }
    }
    
    changeFocus (stationId, element, position) {
        if (this.stationDisplayData[position][stationId][element]) {
            if (this.stationData[position]) {
                let oldStation = null;
                for (let idx=0; idx < this.stationData[position].length; idx++) {
                    if (this.stationData[position][idx].station === stationId) {
                        oldStation = this.stationData[position][idx];
                        break;
                    }
                }
                if (oldStation === null) {
                    oldStation = {
                            station:stationId,
                            year_month:this.yearMonthOffset(this.yearMonth, -position),
                            staff:null,
                            intercepts:null,
                            arrests:null,
                            gospel:null,
                            empowerment:null,
                            budget:null
                            
                    };
                    this.stationData[position].push(oldStation);
                }
                oldStation[element] = this.stationDisplayData[position][stationId][element];
                this.saveCount += 1;
                this.service.updateStationData(oldStation).then (() => {
                    this.saveCount -= 1;
                });
            }
        }
    }
}

export default StationDataController;