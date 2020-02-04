import './collectionIndicators.less';
class IndicatorsController {
    constructor($rootScope, SessionService, collectionIndicatorsService, SpinnerOverlayService) {
        'ngInject';
        
        this.session = SessionService;
        this.indicatorsService = collectionIndicatorsService;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.indicatorsData = null;
        this.indicators = null;
        this.countries = [];
        this.countryRequestCount = 0;
        this.displayIndicators = 13;
        
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
        
        this.startDate = new Date();
        if (this.startDate.getMonth() === 0) {
            this.startDate.setFullYear(this.startDate.getFullYear() - 1);
            this.startDate.setMonth(11);
            this.startDate.setDate(1);
        } else {
            this.startDate.setMonth(this.startDate.getMonth()-1);
            this.startDate.setDate(1);
        }
        
        this.endDate = new Date();
        this.endDate.setDate(0);
        
        this.loading = true;
        this.getCountries();
    }
    
    countryChange() {
        this.ctrl.calculate();
    }
    
    displayPercent(value) {
        if (typeof value === 'undefined' || value === '') {
            return '';
        } else {
            return value + '%';
        }
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
    
    getCellClass(baseClass, idx) {
        let displayClass = baseClass;
        
        if (idx === 0) {
            displayClass = displayClass + ' heavy-border number-value';
        } else if (idx < 0) {
            displayClass = displayClass + ' light-border';
        } else {
            displayClass = displayClass + ' light-border number-value';
        }
        
        return displayClass;
    }
    
    scroll(increment) {
        this.scrollIndicators(this.scrollPos + increment);
    }
    
    scrollIndicators(to_idx) {
        if (this.indicatorsData.length < this.displayIndicators) {
            this.indicators = this.indicatorsData;
            let inds = [];
            for (let idx=0; idx < this.indicatorsData.length; idx++) {
                inds.push(this.indicatorsData[idx]);
            }
            for (let idx=0; idx < (this.displayIndicators-this.indicatorsData.length); idx++) {
                inds.push({});
            }
            this.indicators = inds;
            this.scrollPos = 0;
            this.scrollLeft = false;
            this.scrollRight = false;
        } else {
            let inds = [];
            inds.push(this.indicatorsData[0]);
            if (to_idx < 1) {
                to_idx = 1;
            }
            for (let idx=to_idx; idx < to_idx+this.displayIndicators-1; idx++) {
                inds.push(this.indicatorsData[idx]);
            }
            this.indicators = inds;
            this.scrollPos = to_idx;
            this.scrollLeft = (to_idx > 1);
            this.scrollRight = (to_idx + this.displayIndicators - 1 < this.indicatorsData.length);
        }
    }
    
    dateAsString(theDate) {
        let dateString = '' + theDate.getUTCFullYear() + '-' + (theDate.getUTCMonth() + 1) + '-' + theDate.getUTCDate();
        return dateString;
    }
    
    calculate() {
        if (this.countryDropDown.selectedOptions.length !== 1) {
            return;
        }
        this.spinnerOverlayService.show('Calculating Indicators...');
        this.indicatorsService.calculate(this.countryDropDown.selectedOptions[0].id, this.dateAsString(this.startDate), this.dateAsString(this.endDate)).then(promise => {
            this.indicatorsData = promise.data;
            this.scrollIndicators(1);
            this.spinnerOverlayService.hide();
        }, (error) => {
            alert(error.data);
            this.spinnerOverlayService.hide();
        });
    }
}

export default IndicatorsController;