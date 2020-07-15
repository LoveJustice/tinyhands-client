import './operationsDashboard.less';

class OperationsDashboardController {
    constructor($rootScope, SessionService, operationsDashboardService, SpinnerOverlayService, StickyHeader) {
        'ngInject';
        
        this.session = SessionService;
        this.service = operationsDashboardService;
        this.stickyOptions = StickyHeader.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.selectedStep = 0;
        this.moneyFormat = { style: 'currency', currency: 'USD' , 'minimumFractionDigits': 0, 'maximumFractionDigits': 0 };
        this.digits1Format = {'minimumFractionDigits': 1, 'maximumFractionDigits': 1};
        this.digits2Format = {'minimumFractionDigits': 2, 'maximumFractionDigits': 2};
        this.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.includeClosed = false;
        
        this.editCountries = [];
        this.viewCountries = [];
        
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
        this.service.getUserCountries(this.session.user.id, 'STATION_STATISTICS', 'VIEW').then((promise) => {
            this.viewCountries = promise.data;
            this.dashboardCountry = null;
            for (let idx=0; idx < this.viewCountries.length; idx++) {
                if (this.viewCountries[idx].name === selectedCountryName) {
                    this.dashboardCountry = '' + this.viewCountries[idx].id;
                }
            }
            
           this.dashboardCountrySelect();
        });
    }
    
    dashboardCountrySelect() {
        if (this.dashboardCountry) {
            this.getOperationsDashboard(this.dashboardCountry);
            for (let idx=0; idx < this.viewCountries.length; idx++) {
                if (('' + this.viewCountries[idx].id) === this.dashboardCountry) {
                    this.exchangeRate = this.viewCountries[idx].exchange_rate;
                    sessionStorage.setItem('station-stats-country', this.viewCountries[idx].name);
                    break;
                }
            }
        }
    }
    
    getOperationsDashboard(countryId) {
        this.dashboardData = null;
        this.service.getOperationsDashboard(countryId).then((promise) => {
            this.dashboardData = promise.data;
            
            this.allEntries = 0;
            this.openEntries = 0;
            for (let idx=0; idx < this.dashboardData.entries.length; idx++) {
                this.allEntries += 1;
                if (this.dashboardData.entries[idx].station_open) {
                    this.openEntries += 1;
                }
            }
        });
    }
    
    entryCount() {
        if (this.includeClosed) {
            return this.allEntries;
        }
        return this.openEntries;
    }
    
    computeImpact(entry) {
        let percent_intercepts = 0;
        let percent_arrests = 0;
        let percent_budget = 0;
        let result = null;
        if (this.dashboardData.totals['6month_intercepts']) {
            percent_intercepts = entry['6month_intercepts']/this.dashboardData.totals['6month_intercepts'];
        }
        if (this.dashboardData.totals['6month_arrests']) {
            percent_arrests = entry['6month_arrests']/this.dashboardData.totals['6month_arrests'];
        }
        if (this.dashboardData.totals['6month_budget']) {
            percent_budget = entry['6month_budget']/this.dashboardData.totals['6month_budget'];
        }
        if (percent_budget > 0) {
            result = (percent_intercepts + percent_arrests)/2/percent_budget;
        }
        
        return result;
    }

    save() {
        this.service.setOperationsData(this.dataEntryData).then(() => {
            if (this.dataEntryCountry === this.dashboardCountry) {
                this.getOperationsDashboard(this.dashboardCountry);
            }
        });
    }
}

export default OperationsDashboardController;