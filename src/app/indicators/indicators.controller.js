class IndicatorsController {
    constructor($rootScope, SessionService, indicatorsService, SpinnerOverlayService, countriesService) {
        'ngInject';
        
        this.indicatorsService = indicatorsService;
        this.countriesService = countriesService;
        this.spinnerOverlayService = SpinnerOverlayService
        this.indicatorsData = null;
        
        this.countryDropDown = {};
        this.countryDropDown.options = [];
        this.countryDropDown.selectedOptions = [];
        this.countryDropDown.settings = {
            smartButtonMaxItems: 2,
            showCheckAll: false,
            showUncheckAll: false,
        };
        this.countryDropDown.customText = { buttonDefaultText: 'All' };
        
        this.startDate = '';
        this.endDate = '';
        
        this.loading = true;
        this.getCountries();
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
    
    calculate() {
        this.spinnerOverlayService.show('Calculating Indicators...');
        let params = [];
        params.push({'name':'start_date', 'value':this.dateAsString(this.startDate)});
        params.push({'name':'end_date', 'value':this.dateAsString(this.endDate)});
        if (this.countryDropDown.selectedOptions.length > 0) {
            let countryIds='';
            let sep='';
            for (let idx=0; idx < this.countryDropDown.selectedOptions.length; idx++) {
                countryIds += sep + this.countryDropDown.selectedOptions[idx].id;
                sep = ',';
            }
            
            params.push({'name':'country_ids', 'value':countryIds});
        }
        this.indicatorsService.calculate(params).then(promise => {
            this.indicatorsData = promise.data;
            this.spinnerOverlayService.hide();
        });
    }
}

export default IndicatorsController;