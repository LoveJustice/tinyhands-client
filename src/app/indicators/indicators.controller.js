import './indicators.less';
class IndicatorsController {
    constructor($rootScope, SessionService, indicatorsService, SpinnerOverlayService, countriesService) {
        'ngInject';
        
        this.indicatorsService = indicatorsService;
        this.countriesService = countriesService;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.indicatorsData = null;
        this.displayHistory = 10;
        
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
                ctrl: this,
        };
        
        this.indicatorTypes = [
            {'key':'irfLag', 'name':'IRF Lag Time', 'color':true},
            {'key':'irfCount', 'name':'IRF Forms Entered', 'color':false},
            {'key':'photosLag', 'name':'Photo Upload Lag Time', 'color':true},
            {'key':'photosCount', 'name':'Photos Uploaded', 'color':false},
            {'key':'vdfLag', 'name':'VDF Lag Time', 'color':true},
            {'key':'vdfCount', 'name':'VDF Forms Entered', 'color':false},
            {'key':'cifLag', 'name':'CIF Lag Time', 'color':true},
            {'key':'cifCount', 'name':'CIF Forms Entered', 'color':false},
            {'key':'v1Lag', 'name':'Step 1: Verification Lag time', 'color':true},
            {'key':'v1Count', 'name':'Step 1: Verifications Completed', 'color':false},
            {'key':'v1Backlog', 'name':'Step 1: Verification Backlog', 'color':true},
            {'key':'v2Lag', 'name':'Step 2: Verification Lag time', 'color':true},
            {'key':'v2Count', 'name':'Step 2: Verifications Completed', 'color':false},
            {'key':'v2Backlog', 'name':'Step 2: Verification Backlog', 'color':true},
        ];
        
        this.startDate = '';
        this.endDate = '';
        
        this.loading = true;
        this.getCountries();
    }
    
    countryChange() {
        this.ctrl.calculate();
    }
    
    getCountries() {
        this.countriesService.getCountries([]).then((promise) => {
            this.countries = promise.data.results;
            for (var idx = 0; idx < this.countries.length; idx++) {
                this.countryDropDown.options.push({
                    id: this.countries[idx].id,
                    label: this.countries[idx].name,
                });
            }
            this.loading = false;
        });
    }
    
    dateAsString(theDate) {
        let dateString = '' + theDate.getUTCFullYear() + '-' + (theDate.getUTCMonth() + 1) + '-' + theDate.getUTCDate();
        return dateString;
    }
    
    scroll(increment) {
        this.scrollHistory(this.scrollPos + increment);
    }
    
    scrollHistory(to_idx) {
        if (this.indicatorsData.history.length < this.displayHistory) {
            this.history = this.indicatorsData.history;
            let hist = [];
            for (let idx=0; idx < this.indicatorsData.history.length; idx++) {
                hist.push(this.indicatorsData.history[idx]);
            }
            for (let idx=0; idx < (this.displayHistory-this.indicatorsData.history.length); idx++) {
                hist.push({});
            }
            this.history = hist;
            this.scrollPos = 0;
            this.scrollLeft = false;
            this.scrollRight = false;
        } else {
            let hist = [];
            for (let idx=to_idx; idx < to_idx+this.displayHistory; idx++) {
                hist.push(this.indicatorsData.history[idx]);
            }
            this.history = hist;
            this.scrollPos = to_idx;
            this.scrollLeft = (to_idx > 0);
            this.scrollRight = (to_idx + this.displayHistory < this.indicatorsData.history.length);
        }
    }
    
    calculate() {
        if (this.countryDropDown.selectedOptions.length !== 1) {
            return;
        }
        this.spinnerOverlayService.show('Calculating Indicators...');
        this.indicatorsService.calculate(this.countryDropDown.selectedOptions[0].id).then(promise => {
            this.indicatorsData = promise.data;
            this.scrollHistory(0);
            this.spinnerOverlayService.hide();
        });
    }
    
    getCellClass(entry, value, extra='') {
        let goal = this.indicatorsData.goals[entry.key];
        if (!entry.color || isNaN(value)) {
            return extra;
        }
        
        if (value < goal / 2) {
            return "exceeds-goal" + " " + extra;
        } else if (value <= goal) {
            return "meets-goal" + " " + extra;
        } else if (value <= goal * 2) {
            return "needs-improvement" + " " + extra;
        } else {
            return "does-not-meet-goal" + " " + extra;
        }
    }
}

export default IndicatorsController;