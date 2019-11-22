import './monthlyReportSummary.less';
export default class MonthlyReportSummaryController {
    constructor(MonthlyReportService, MonthlyReportListService, $scope, SessionService) {
        'ngInject';

        this.service = MonthlyReportService;
        this.listService = MonthlyReportListService;
        this.scope = $scope;
        this.session = SessionService;
        
        this.countryDropDown = {};
        this.countryDropDown.options = [];
        this.countryDropDown.selectedOptions = [];
        this.countryDropDown.settings = {
                smartButtonMaxItems:1,
                selectionLimit:1,
                closeOnSelect: true,
                showCheckAll: false,
                showUncheckAll: false,
            };
        this.countryDropDown.eventListener = {
            onItemSelect: this.countryChange,
            onItemDeselect: this.countryChange,
            onSelectAll: this.countryChange,
            onDeselectAll: this.countryChange,
            ctrl: this   
        };
        
        let today = new Date();
        let month = today.getMonth();
        this.year = today.getFullYear();
        if (month < 1) {
            month = 11;
            this.year -= 1;
        }
        this.month = month.toString();
        
        this.getUserCountries();
    }

    create() {
        this.$uibModalInstance.close(this.scope.stationDropDown.selectedOptions[0]);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }
    
    getUserCountries() {
        this.listService.getUserCountries(this.session.user.id).then((promise) => {
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
    
    colorCell(value) {
        if (value >= 90) {
            return ' meets-goal';
        } else if (value >= 70) {
            return ' near-goal';
        } else if (value >= 30) {
            return ' below-goal';
        } else {
            return ' far-below-goal';
        }
    }
    
    getClass(index, value) {
        let displayClass = this.getBorderClass(index);
        if (index === this.summaryData.headings.length - 1) {
            displayClass += this.colorCell(value);
        }
        return displayClass;
    }
    
    getAverageClass(index, value) {
        let displayClass = this.getBorderClass(index, 'cell-top-border');
        if (index > 0) {
            displayClass += this.colorCell(value);
        }
        
        return displayClass;
    }
    
    getBorderClass(index, displayClass = "") {
        if (index === 0) {
            displayClass = displayClass + " cell-right-border";
        }
        if (index === this.summaryData.headings.length - 1) {
            displayClass = displayClass + " cell-left-border";
        }
        
        return displayClass;
    }
    
    countryChange() {
        this.ctrl.getSummary();
    }
    
    getSummary() {
        if (this.countryDropDown.selectedOptions.length < 1) {
            return;
        }
        this.summaryData = null;
        this.noReports = false;
        this.service.getMonthlyReportSummary(this.countryDropDown.selectedOptions[0].id, this.year, this.month).then((promise) => {
            if (promise.data.reports.length > 0) {
                this.summaryData = promise.data;
            } else {
                this.noReports = true;
            }
        }, (error) => {
            this.error = error;
        });
    }
}
