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
           // {'key':'v2ChangeCount', 'name':'Verification Change', 'color':false},
            {'key':'v2ConflictPercent', 'name':'Conflict %', 'color':false},
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
        let len = this.countries.length;
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
            if (this.indicatorsData.blind) {
                this.indicatorTypes = [
                    {'key':'irfLag', 'name':'IRF Lag Time', 'color':true},
                    {'key':'irfOriginalFormPercent', 'name':'IRF Original Form Attached %', 'color':false},
                    {'key':'irfCount', 'name':'IRF Forms Entered', 'color':false},
                    {'key':'vdfLag', 'name':'VDF Lag Time', 'color':true},
                    {'key':'vdfOriginalFormPercent', 'name':'VDF Original Form Attached %', 'color':false},
                    {'key':'vdfCount', 'name':'VDF Forms Entered', 'color':false},
                    {'key':'cifLag', 'name':'CIF Lag Time', 'color':true},
                    {'key':'cifCount', 'name':'CIF Forms Entered', 'color':false},
                    {'key':'cifOriginalFormPercent', 'name':'CIF Original Form Attached %', 'color':false},
                    
                    {'key':'pvfLag', 'name':'PVF Lag Time', 'color':true},
                    {'key':'pvfOriginalFormPercent', 'name':'PVF Original Form Attached %', 'color':false},
                    {'key':'pvfCount', 'name':'PVF Forms Entered', 'color':false},
                    {'key':'sfLag', 'name':'SF Lag Time', 'color':true},
                    {'key':'sfOriginalFormPercent', 'name':'SF Original Form Attached %', 'color':false},
                    {'key':'sfCount', 'name':'SF Forms Entered', 'color':false},
                    {'key':'lfLag', 'name':'LF Lag Time', 'color':true},
                    {'key':'lfOriginalFormPercent', 'name':'LF Original Form Attached %', 'color':false},
                    {'key':'lfCount', 'name':'LF Forms Entered', 'color':false},
                    
                    {'key':'v1Lag', 'name':'Initial Verification Lag time', 'color':true},
                    {'key':'v1Backlog', 'name':'Initial Verification Backlog', 'color':true},
                    {'key':'v1Count', 'name':'Initial Verifications Completed', 'color':false},
                    {'key':'v2Lag', 'name':'Tie Break Verification Lag time', 'color':true},
                    {'key':'v2Backlog', 'name':'Tie Break Verification Backlog', 'color':true},
                    {'key':'v2Count', 'name':'Tie Break Verifications Completed', 'color':false},
                    {'key':'mdfSignedPercent', 'name':'MDF Signed %', 'color':false},
                ];
                
            } else {
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
                    
                    {'key':'pvfLag', 'name':'PVF Lag Time', 'color':true},
                    {'key':'pvfCount', 'name':'PVF Forms Entered', 'color':false},
                    {'key':'pvfOriginalFormPercent', 'name':'PVF Original Form Attached %', 'color':false},
                    
                    {'key':'v1Lag', 'name':'Step 1: Verification Lag time', 'color':true},
                    {'key':'v1Count', 'name':'Step 1: Verifications Completed', 'color':false},
                    {'key':'v1Backlog', 'name':'Step 1: Verification Backlog', 'color':true},
                    {'key':'v2Lag', 'name':'Step 2: Verification Lag time', 'color':true},
                    {'key':'v2Count', 'name':'Step 2: Verifications Completed', 'color':false},
                    {'key':'v2Backlog', 'name':'Step 2: Verification Backlog', 'color':true},
                   // {'key':'v2ChangeCount', 'name':'Verification Change', 'color':false},
                    {'key':'v2ConflictPercent', 'name':'Conflict %', 'color':false},
                    {'key':'mdfSignedPercent', 'name':'MDF Signed %', 'color':false},
                ];
            }
            
            // Value on server is the number of conflicts between the validations.  Compute the percentage
            // of conflicting validations.
            if (!this.indicatorsData.latest.v2Count || isNaN(this.indicatorsData.latest.v2ChangeCount)) {
                this.indicatorsData.latest.v2ConflictPercent = null;
            } else {
                this.indicatorsData.latest.v2ConflictPercent = +((this.indicatorsData.latest.v2ChangeCount * 100  / this.indicatorsData.latest.v2Count).toFixed(2)); 
            }
            for (let idx in this.indicatorsData.history) {
                if (!this.indicatorsData.history[idx].v2Count || isNaN(this.indicatorsData.history[idx].v2ChangeCount)) {
                    this.indicatorsData.history[idx].v2ConflictPercent = null;
                } else {
                    this.indicatorsData.history[idx].v2ConflictPercent = +((this.indicatorsData.history[idx].v2ChangeCount * 100  / this.indicatorsData.history[idx].v2Count).toFixed(2)); 
                }
            }
            this.scrollHistory(0);
            this.spinnerOverlayService.hide();
        });
    }
    
    hasData(obj, key) {
    	if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== '') {
    		return true;
    	}
    	return false;
    }
    
    doesEntryHaveData(entry) {
    	if (this.hasData(this.indicatorsData.latest, entry.key)) {
    		return true;
    	}
    	
    	for (let idx in this.history) {
    		if (this.hasData(this.history[idx], entry.key)) {
    			return true;
    		}
    	}
    	
    	return false;
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