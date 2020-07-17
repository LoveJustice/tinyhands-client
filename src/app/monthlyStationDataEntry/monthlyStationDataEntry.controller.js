/* global jQuery */
import './monthlyStationDataEntry.less';
class MonthlyStationDataEntryController {
    constructor($rootScope, SessionService, monthlyStationDataEntryService, SpinnerOverlayService, StickyHeader) {
        'ngInject';
        
        this.session = SessionService;
        this.service = monthlyStationDataEntryService;
        this.stickyOptions = StickyHeader.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.stickyOptions.top = 50;
        this.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.editCountries = [];
        
        let today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        if (today.getDate() < 6) {
            this.currentMonth -= 1;
        }
        if (this.currentMonth < 1) {
            this.currentYear -= 1;
            this.currentMonth = 12 - this.currentMonth;
        }
        this.showYear = this.currentYear;
        this.showMonth = this.currentMonth;
        this.showDate = new Date(this.showYear, this.showMonth-1);
        
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
            this.editCountries = promise.data;
            this.dataEntryCountry = null;
            for (let idx=0; idx < this.editCountries.length; idx++) {
                if (this.editCountries[idx].name === selectedCountryName) {
                    this.dataEntryCountry = '' + this.editCountries[idx].id;
                    break;
                }
            }
            
            this.dataEntryCountrySelect();
        });
    }
    
    dataEntryCountrySelect() {
        if (this.dataEntryCountry) {
            this.getOperationsData(this.dataEntryCountry, this.showYear, this.showMonth);
            for (let idx=0; idx < this.editCountries.length; idx++) {
                if (('' + this.editCountries[idx].id) === this.dataEntryCountry) {
                    sessionStorage.setItem('station-stats-country', this.editCountries[idx].name);
                    break;
                }
            }
        }
    }
    
    changeDate() {
        this.showMonth = this.showDate.getMonth() + 1;
        this.showYear = this.showDate.getFullYear();
        
        this.dataEntryCountrySelect();
    }
    
    getOperationsData(countryId, year, month) {
        //this.dataEntryData = null;
        this.service.getOperationsData(countryId, year, month).then((promise) => {
            this.dataEntryData = promise.data;
            this.originalData = jQuery.extend(true, {}, promise.data);
        });
        
    }
    
    changeMonth(increment) {
        if (this.hasBeenModified()) {
            if (window.confirm("The current month's data has been modified.  Select OK to save the data before scrolling.  Select Cancel to scroll without saving the modifications")) {
                this.save();
            }
        }
        this.showMonth += increment;
        if (this.showMonth > 12) {
            this.showMonth = 1;
            this.showYear += 1;
        }
        if (this.showMonth < 1) {
            this.showMonth = 12;
            this.showYear -= 1;
        }

        this.dataEntryCountrySelect();
        this.showDate = new Date(this.showYear, this.showMonth-1);
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

    save() {
        this.service.setOperationsData(this.dataEntryData).then(() => {
            if (this.dataEntryCountry === this.dashboardCountry) {
                this.getOperationsDashboard(this.dashboardCountry);
            }
        });
    }
}

export default MonthlyStationDataEntryController;