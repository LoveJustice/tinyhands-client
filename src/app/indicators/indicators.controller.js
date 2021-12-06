import './indicators.less';
class IndicatorsController {
    constructor($rootScope, SessionService, indicatorsService, SpinnerOverlayService, StickyHeader) {
        'ngInject';
        
        this.session = SessionService;
        this.indicatorsService = indicatorsService;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.sticky = StickyHeader;
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;
        this.indicatorsData = null;
        this.highlight = null;
        this.displayHistory = 10;
        this.countries = [];
        this.countryRequestCount = 0;
        
        this.labelWidth = 230;
        this.goalWidth = 50;
        this.last30Width = 75;
        this.dataWidth = 85;
        this.margin = 150;
        let remaining = window.innerWidth - (this.labelWidth + this.goalWidth + this.last30Width + this.margin);
        if (remaining > 2 * this.dataWidth) {
            this.displayHistory = Math.floor(remaining / this.dataWidth);
        } else {
            this.displayHistory = 2;
        }
        this.tableDivSize = (window.innerWidth - this.margin) + 'px';
        
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
            {'key':'irfOriginalFormPercent', 'name':'IRF Original Form Attached %', 'color':false},
            {'key':'photosLag', 'name':'Photo Upload Lag Time', 'color':true},
            {'key':'photosCount', 'name':'Photos Uploaded', 'color':false},
            {'key':'vdfLag', 'name':'VDF Lag Time', 'color':true},
            {'key':'vdfCount', 'name':'VDF Forms Entered', 'color':false},
            {'key':'vdfOriginalFormPercent', 'name':'VDF Original Form Attached %', 'color':false},
            {'key':'cifLag', 'name':'CIF Lag Time', 'color':true},
            {'key':'cifCount', 'name':'CIF Forms Entered', 'color':false},
            {'key':'cifOriginalFormPercent', 'name':'CIF Original Form Attached %', 'color':false},
            {'key':'v1Lag', 'name':'Step 1: Verification Lag time', 'color':true},
            {'key':'v1Count', 'name':'Step 1: Verifications Completed', 'color':false},
            {'key':'v1Backlog', 'name':'Step 1: Verification Backlog', 'color':true},
            {'key':'v2Lag', 'name':'Step 2: Verification Lag time', 'color':true},
            {'key':'v2Count', 'name':'Step 2: Verifications Completed', 'color':false},
            {'key':'v2Backlog', 'name':'Step 2: Verification Backlog', 'color':true},
            {'key':'v2ChangeCount', 'name':'Verification Change', 'color':false},
        ];
        
        this.startDate = '';
        this.endDate = '';
        
        this.loading = true;
        this.getCountries();
    }
    
    countryChange() {     
        this.ctrl.calculate();
    }
    
    mergeCountries() {
        let len = this.countries.length - 1;
        let result_array = [];
        let assoc = {};
        
        while (len--) {
            let item = this.countries[len];
            
            if (!assoc[item.id]) {
                result_array.unshift(item);
                assoc[item.id] = true;
            }
        }
        
        result_array.sort((a,b)=>{
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        
        for (var idx = 0; idx < result_array.length; idx++) {
            this.countryDropDown.options.push({
                id: result_array[idx].id,
                label: result_array[idx].name,
            });
        }
        
        let selectedCountryName = window.localStorage.getItem('dashboard-country');
        for (var countryIdx=0; countryIdx < this.countryDropDown.options.length; countryIdx++) {
            if (this.countryDropDown.options[countryIdx].label === selectedCountryName) {
                this.countryDropDown.selectedOptions = [this.countryDropDown.options[countryIdx]];
                this.calculate();
                break;
            }
        }
        this.loading = false;
    }
    
    getCountries() {
        this.indicatorsService.getUserCountries(this.session.user.id, 'IRF').then((promise) => {
            this.countries = this.countries.concat(promise.data);
            this.countryRequestCount += 1;
            if (this.countryRequestCount > 2) {
                this.mergeCountries();
            }
        });
        this.indicatorsService.getUserCountries(this.session.user.id, 'CIF').then((promise) => {
            this.countries = this.countries.concat(promise.data);
            this.countryRequestCount += 1;
            if (this.countryRequestCount > 2) {
                this.mergeCountries();
            }
        });
        this.indicatorsService.getUserCountries(this.session.user.id, 'VDF').then((promise) => {
            this.countries = this.countries.concat(promise.data);
            this.countryRequestCount += 1;
            if (this.countryRequestCount > 2) {
                this.mergeCountries();
            }
        });
    }
    
    dateAsString(theDate) {
        let dateString = '' + theDate.getUTCFullYear() + '-' + (theDate.getUTCMonth() + 1) + '-' + theDate.getUTCDate();
        return dateString;
    }
    
    scroll(increment) {
        this.scrollHistory(this.scrollPos + increment);
        if (this.highlight !== null) {
            this.highlight -= increment;
        }
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
    
    selectColumn(idx) {
        if (this.highlight === idx) {
            this.highlight = null;
        }  else {
            this.highlight = idx;
        }
    }
    
    getCellClass(entry, value, idx) {
        let displayClass = "";
        let goal = this.indicatorsData.goals[entry.key];
        if (!entry.color || isNaN(value)) {
            displayClass = "no-color";
        } else if (value < goal/2) {
            displayClass = "exceeds-goal";
        } else if (value <= goal) {
            displayClass = "meets-goal";
        } else if (value <= goal * 2) {
            displayClass = "needs-improvement";
        } else {
            displayClass = "does-not-meet-goal";
        }
        if (this.highlight === null || this.highlight === idx) {
            displayClass = displayClass + "-highlight";
        } else {
            displayClass = displayClass + "-non-highlight";
        }
        
        if (idx < -1000) {
            displayClass = displayClass + " cell-right-border cell-bold";
        } else if (idx >= 0 && typeof this.history[idx].title1 !== 'undefined') {
            displayClass = displayClass + " cell-light-border";
        }
        
        return displayClass;
    }
}

export default IndicatorsController;